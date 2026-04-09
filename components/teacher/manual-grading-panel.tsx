"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { toast } from "sonner";
import WaveSurfer from "wavesurfer.js";
import { ExamAttempt } from "@/lib/types";
import { getFirebaseServices } from "@/lib/firebase/client";
import { now } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ManualGradingPanel({ attempts }: { attempts: ExamAttempt[] }) {
  const services = getFirebaseServices();
  const { profile } = useAuth();
  const submitted = useMemo(
    () => attempts.filter((x) => x.status === "submitted" || x.status === "auto_submitted").slice(0, 12),
    [attempts],
  );

  const [editingId, setEditingId] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const waveformContainerRef = useRef<HTMLDivElement | null>(null);
  const waveformRef = useRef<WaveSurfer | null>(null);

  function beginEdit(attempt: ExamAttempt) {
    setEditingId(attempt.id);
    setScore(attempt.score ?? 0);
    setFeedback(attempt.graderFeedbackText ?? "");
    setAudioFile(null);
    setAudioPreviewUrl(null);
  }

  useEffect(() => {
    if (!audioFile) {
      setAudioPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(audioFile);
    setAudioPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [audioFile]);

  useEffect(() => {
    if (!audioPreviewUrl || !waveformContainerRef.current) {
      waveformRef.current?.destroy();
      waveformRef.current = null;
      return;
    }

    waveformRef.current?.destroy();
    const wave = WaveSurfer.create({
      container: waveformContainerRef.current,
      waveColor: "#64748b",
      progressColor: "#6366f1",
      cursorColor: "#a5b4fc",
      barWidth: 2,
      barGap: 2,
      height: 56,
    });
    waveformRef.current = wave;
    wave.load(audioPreviewUrl);
    wave.on("finish", () => setPlaying(false));
    return () => {
      wave.destroy();
      waveformRef.current = null;
    };
  }, [audioPreviewUrl]);

  async function saveGrade() {
    if (!services || !profile || !editingId) {
      return;
    }

    let graderFeedbackAudioPath: string | undefined;
    if (audioFile) {
      const path = `feedback/${editingId}/audio-${now()}-${audioFile.name}`;
      await uploadBytes(ref(services.storage, path), audioFile, {
        contentType: audioFile.type || "audio/webm",
      });
      graderFeedbackAudioPath = path;
    }

    await updateDoc(doc(services.db, "attempts", editingId), {
      score,
      graderFeedbackText: feedback,
      graderFeedbackAudioPath: graderFeedbackAudioPath ?? null,
      gradedBy: profile.uid,
      gradedAt: now(),
      updatedAt: now(),
    });

    toast.success("Manual grading saved");
    setEditingId(null);
  }

  return (
    <Card className="border-slate-700/75 bg-[#0b1220] text-slate-100">
      <CardContent className="p-5">
        <h3 className="mb-3 text-lg font-medium">Manual Grading + Audio Feedback</h3>
        <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <div className="space-y-2">
          {submitted.map((attempt) => (
            <button
              key={attempt.id}
              type="button"
              onClick={() => beginEdit(attempt)}
              className={`w-full rounded-xl border p-2 text-left text-sm transition ${
                editingId === attempt.id ? "border-primary bg-primary/15" : "border-slate-600 bg-slate-900/50"
              }`}
            >
              <p className="font-medium">{attempt.studentId}</p>
              <p className="text-slate-400">Score: {attempt.score ?? "-"}</p>
            </button>
          ))}
          {submitted.length === 0 && <p className="text-sm text-slate-400">No submitted attempts available.</p>}
        </div>

          <div className="space-y-3 rounded-xl border border-slate-600 bg-slate-900/50 p-3">
          {editingId ? (
            <>
              <label className="block text-sm">
                Score
                  <Input
                  type="number"
                    className="mt-1 border-slate-600 bg-slate-950/60 text-slate-100"
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                />
              </label>

              <label className="block text-sm">
                Feedback
                  <Textarea
                    className="mt-1 min-h-24 border-slate-600 bg-slate-950/60 text-slate-100 placeholder:text-slate-400"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </label>

              <label className="block text-sm">
                Audio feedback file
                <input
                  type="file"
                  accept="audio/*"
                    className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950/60 px-3 py-2 text-sm"
                  onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
                />
              </label>
              {audioPreviewUrl ? (
                <div className="rounded-xl border border-slate-600 bg-slate-950/60 p-3">
                  <p className="mb-2 text-xs text-slate-300">Audio waveform preview</p>
                  <div ref={waveformContainerRef} />
                  <Button
                    type="button"
                    variant="ghost"
                    className="mt-2"
                    onClick={() => {
                      if (!waveformRef.current) {
                        return;
                      }
                      waveformRef.current.playPause();
                      setPlaying((prev) => !prev);
                    }}
                  >
                    {playing ? "Pause Preview" : "Play Preview"}
                  </Button>
                </div>
              ) : null}

                <Button type="button" onClick={saveGrade}>Save grade</Button>
            </>
          ) : (
              <p className="text-sm text-slate-400">Select a submitted attempt to grade.</p>
          )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
