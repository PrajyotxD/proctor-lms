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
      console.error("Video ref not available");
      return;
    }

    try {
      setCapturing(true);
      console.log("Capturing frame from video");
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      console.log("Canvas dimensions:", canvas.width, "x", canvas.height);
      
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Failed to get canvas context");
        setCapturing(false);
        toast.error("Failed to capture image");
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
      if (!blob) {
        console.error("Failed to create blob from canvas");
        setCapturing(false);
        toast.error("Failed to create image");
        return;
      }

      console.log("Snapshot captured, size:", blob.size, "bytes");
      setSnapshot(blob);
      toast.success("Selfie captured!");
    } catch (error) {
      console.error("Capture failed:", error);
      toast.error("Failed to capture selfie");
    } finally {
      setCapturing(false);
    }
  }

  async function saveVerification() {
    if (!services || !user) {
      console.error("Missing services or user");
      toast.error("Services not ready");
      return;
    }

    if (!rollNumber.trim()) {
      console.warn("Roll number is empty");
      toast.error("Roll number is required");
      return;
    }

    if (!snapshot) {
      console.warn("No snapshot captured");
      toast.error("Capture selfie first");
      return;
    }

    try {
      console.log("Starting verification save for user:", user.uid);
      
      // Upload selfie to storage
      const path = `verification/${user.uid}/selfie-${now()}.jpg`;
      console.log("Uploading selfie to:", path);
      await uploadBytes(ref(services.storage, path), snapshot, { contentType: "image/jpeg" });
      console.log("Selfie uploaded successfully");

      // Create verification document
      console.log("Creating verification document");
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
      console.log("Verification document created");

      // Update user profile
      console.log("Updating user profile");
      await updateDoc(doc(services.db, "users", user.uid), {
        rollNumber: rollNumber.trim(),
        verificationPhotoPath: path,
        verifiedAt: now(),
        updatedAt: now(),
      });
      console.log("User profile updated");

      toast.success("Verification saved successfully!");
      setStep(1);
      setSnapshot(null);
    } catch (error) {
      console.error("Verification save failed:", error);
      const message = error instanceof Error ? error.message : "Failed to save verification";
      toast.error(message);
    }
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
