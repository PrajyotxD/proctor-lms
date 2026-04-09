"use client";

import { useEffect, useRef, useState } from "react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { toast } from "sonner";
import { getFirebaseServices } from "@/lib/firebase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { now } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function StudentVerificationCard() {
  const { user, profile } = useAuth();
  const services = getFirebaseServices();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [rollNumber, setRollNumber] = useState(profile?.rollNumber ?? "");
  const [capturing, setCapturing] = useState(false);
  const [snapshot, setSnapshot] = useState<Blob | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    let active = true;
    let streamRef: MediaStream | null = null;

    async function start() {
      if (!videoRef.current) {
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });

      if (!active) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }

    start().catch(() => void 0);

    return () => {
      active = false;
      streamRef?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  async function capture() {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    setCapturing(true);
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setCapturing(false);
      return;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
    if (!blob) {
      setCapturing(false);
      return;
    }

    setSnapshot(blob);
    setCapturing(false);
  }

  async function saveVerification() {
    if (!services || !user) {
      return;
    }

    if (!rollNumber.trim()) {
      toast.error("Roll number is required");
      return;
    }

    if (!snapshot) {
      toast.error("Capture selfie first");
      return;
    }

    const path = `verification/${user.uid}/selfie-${now()}.jpg`;
    await uploadBytes(ref(services.storage, path), snapshot, { contentType: "image/jpeg" });

    await setDoc(
      doc(services.db, "verifications", user.uid),
      {
        uid: user.uid,
        rollNumber: rollNumber.trim(),
        selfiePath: path,
        verifiedAt: now(),
      },
      { merge: true },
    );

    await updateDoc(doc(services.db, "users", user.uid), {
      rollNumber: rollNumber.trim(),
      verificationPhotoPath: path,
      verifiedAt: now(),
      updatedAt: now(),
    });

    toast.success("Verification saved");
  }

  return (
    <Card className="border-slate-700/70 bg-[#0b1220] text-slate-100">
      <CardContent className="space-y-4 p-5">
        <h2 className="text-lg font-semibold">Verification Gate</h2>
        <p className="text-sm text-slate-300">Step {step} of 3 - Camera Check, ID Verification, Environment Scan</p>

        <div className="grid gap-3 lg:grid-cols-[280px_1fr]">
          <video ref={videoRef} muted playsInline className="aspect-video w-full rounded-xl border border-slate-700 bg-black" />
          <div className="space-y-3">
            <Input
              className="border-slate-600 bg-slate-900/65 text-slate-100 placeholder:text-slate-400"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="Roll number"
            />
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="ghost" onClick={() => setStep(1)}>1. Camera Check</Button>
              <Button type="button" variant="ghost" onClick={() => setStep(2)}>2. ID Verification</Button>
              <Button type="button" variant="ghost" onClick={() => setStep(3)}>3. Environment Scan</Button>
            </div>
            <div className="flex gap-2">
              <Button type="button" onClick={capture} disabled={capturing}>
                {capturing ? "Capturing..." : "Capture selfie"}
              </Button>
              <Button type="button" variant="ghost" onClick={saveVerification}>
                Save verification
              </Button>
            </div>
            <p className="text-xs text-slate-400">
              Current status: {profile?.verifiedAt ? `Verified (${new Date(profile.verifiedAt).toLocaleString()})` : "Not verified"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
