"use client";

import { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebaseServices } from "@/lib/firebase/client";
import type { Exam, ExamAttempt, ProctorIncidentType } from "@/lib/types";
import { isMobileDevice, now } from "@/lib/utils";
import { useFaceSignals } from "@/hooks/use-face-signals";

export type ProctorSignal = {
  type: ProctorIncidentType;
  severity: "low" | "medium" | "high";
  meta?: Record<string, string | number | boolean | null>;
};

const MOBILE_ORIENTATION_LIMIT = 55;
const INCIDENT_COOLDOWN_MS = 8_000;
const GAZE_AWAY_MS = 12_000;

export function useExamProctoring(params: {
  exam: Exam | null;
  attempt: ExamAttempt | null;
  uid: string;
}) {
  const { exam, attempt, uid } = params;
  const services = getFirebaseServices();
  const [violationCount, setViolationCount] = useState(attempt?.violationCount ?? 0);
  const [isFrozen, setIsFrozen] = useState(false);
  const [freezeMessage, setFreezeMessage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const faceSignals = useFaceSignals(videoRef, Boolean(exam?.webcamRequired && attempt));
  const incidentCooldownRef = useRef<Record<ProctorIncidentType, number>>({} as Record<ProctorIncidentType, number>);
  const hiddenSinceRef = useRef<number | null>(null);

  useEffect(() => {
    if (!attempt || !services) {
      return;
    }

    const controlsRef = doc(services.db, "attemptControls", attempt.id);
    return onSnapshot(controlsRef, (snap) => {
      if (!snap.exists()) {
        setIsFrozen(false);
        setFreezeMessage(null);
        return;
      }

      const data = snap.data() as { frozen?: boolean; message?: string };
      setIsFrozen(Boolean(data.frozen));
      setFreezeMessage(data.message ?? null);
    });
  }, [attempt, services]);

  useEffect(() => {
    let active = true;
    async function startCamera() {
      if (!exam?.webcamRequired || !videoRef.current) {
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: isMobileDevice() ? 640 : 1280 },
          height: { ideal: isMobileDevice() ? 480 : 720 },
        },
        audio: false,
      });

      if (!active) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      mediaStreamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }

    startCamera().catch(() => void 0);

    return () => {
      active = false;
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [exam?.webcamRequired]);

  async function uploadEvidence(blob: Blob, pathHint: string) {
    if (!services || !attempt) {
      return undefined;
    }

    const path = `evidence/${attempt.examId}/${attempt.id}/${pathHint}-${now()}.webm`;
    const fileRef = ref(services.storage, path);
    await uploadBytes(fileRef, blob, { contentType: blob.type || "video/webm" });
    await getDownloadURL(fileRef);
    return path;
  }

  async function captureMobileFrame() {
    const video = videoRef.current;
    if (!video || !services || !attempt) {
      return undefined;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return undefined;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.8),
    );

    if (!blob) {
      return undefined;
    }

    const path = `evidence/${attempt.examId}/${attempt.id}/frame-${now()}.jpg`;
    await uploadBytes(ref(services.storage, path), blob, { contentType: "image/jpeg" });
    return path;
  }

  async function tryDesktopEvidence(signalType: ProctorIncidentType) {
    if (!services || !attempt || isMobileDevice()) {
      return undefined;
    }

    if (!navigator.mediaDevices?.getDisplayMedia || typeof MediaRecorder === "undefined") {
      return undefined;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      const stopPromise = new Promise<Blob>((resolve) => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
      });

      recorder.start();
      await new Promise((resolve) => setTimeout(resolve, 3500));
      recorder.stop();
      stream.getTracks().forEach((track) => track.stop());
      const blob = await stopPromise;

      return uploadEvidence(blob, signalType);
    } catch {
      return undefined;
    }
  }

  async function emitIncident(signal: ProctorSignal) {
    if (!services || !exam || !attempt) {
      return;
    }

    const emittedAt = now();
    const lastSeen = incidentCooldownRef.current[signal.type] ?? 0;
    if (emittedAt - lastSeen < INCIDENT_COOLDOWN_MS) {
      return;
    }

    incidentCooldownRef.current[signal.type] = emittedAt;

    const currentViolationCount = violationCount + 1;
    setViolationCount(currentViolationCount);

    const evidencePath = isMobileDevice()
      ? await captureMobileFrame()
      : await tryDesktopEvidence(signal.type);

    await addDoc(collection(services.db, "incidents"), {
      examId: exam.id,
      attemptId: attempt.id,
      studentId: uid,
      type: signal.type,
      severity: signal.severity,
      meta: signal.meta ?? {},
      evidencePath: evidencePath ?? null,
      createdAt: emittedAt,
    });

    await updateDoc(doc(services.db, "attempts", attempt.id), {
      violationCount: currentViolationCount,
      proctoringScore: Math.max(0, 100 - currentViolationCount * 7),
      updatedAt: emittedAt,
    });

    if (currentViolationCount >= exam.autoSubmitViolationThreshold) {
      await updateDoc(doc(services.db, "attempts", attempt.id), {
        status: "auto_submitted",
        submittedAt: emittedAt,
      });
    }
  }

  useEffect(() => {
    if (!attempt || !services) {
      return;
    }

    const onHidden = () => {
      if (document.hidden) {
        hiddenSinceRef.current = now();
        void emitIncident({ type: "tab_hidden", severity: "high" });
      } else if (hiddenSinceRef.current) {
        const hiddenFor = now() - hiddenSinceRef.current;
        hiddenSinceRef.current = null;
        if (hiddenFor >= GAZE_AWAY_MS) {
          void emitIncident({
            type: "gaze_away",
            severity: "medium",
            meta: { hiddenForMs: hiddenFor },
          });
        }
      }
    };

    const onBlur = () => void emitIncident({ type: "window_blur", severity: "medium" });
    const onCopy = () => void emitIncident({ type: "copy_attempt", severity: "high" });
    const onPaste = () => void emitIncident({ type: "paste_attempt", severity: "high" });
    const onContext = (event: Event) => {
      event.preventDefault();
      void emitIncident({ type: "context_menu", severity: "medium" });
    };

    const onOrientation = () => {
      const angle = Math.abs((window.screen.orientation?.angle ?? 0) % 180);
      if (isMobileDevice() && angle > MOBILE_ORIENTATION_LIMIT) {
        void emitIncident({
          type: "orientation_suspicious",
          severity: "medium",
          meta: { angle },
        });
      }
    };

    const onFullscreen = () => {
      if (exam?.requireFullscreen && !document.fullscreenElement) {
        void emitIncident({ type: "fullscreen_exit", severity: "high" });
      }
    };

    document.addEventListener("visibilitychange", onHidden);
    window.addEventListener("blur", onBlur);
    document.addEventListener("copy", onCopy);
    document.addEventListener("paste", onPaste);
    document.addEventListener("contextmenu", onContext);
    screen.orientation?.addEventListener?.("change", onOrientation);
    document.addEventListener("fullscreenchange", onFullscreen);

    void setDoc(
      doc(services.db, "attemptControls", attempt.id),
      {
        id: attempt.id,
        attemptId: attempt.id,
        frozen: false,
        message: "",
        updatedBy: "system",
        updatedAt: now(),
      },
      { merge: true },
    );

    return () => {
      document.removeEventListener("visibilitychange", onHidden);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("paste", onPaste);
      document.removeEventListener("contextmenu", onContext);
      screen.orientation?.removeEventListener?.("change", onOrientation);
      document.removeEventListener("fullscreenchange", onFullscreen);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt?.id, services, exam?.requireFullscreen]);

  useEffect(() => {
    if (!attempt) {
      return;
    }

    if (faceSignals.missingFace) {
      void emitIncident({ type: "missing_face", severity: "high" });
      return;
    }

    if (faceSignals.multipleFaces) {
      void emitIncident({ type: "multiple_faces", severity: "high" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faceSignals.missingFace, faceSignals.multipleFaces, attempt?.id]);

  return {
    isFrozen,
    freezeMessage,
    violationCount,
    videoRef,
    emitIncident,
  };
}
