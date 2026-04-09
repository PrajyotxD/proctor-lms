"use client";

import { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";

type FaceSignal = {
  missingFace: boolean;
  multipleFaces: boolean;
  confidence: number;
};

export function useFaceSignals(videoRef: React.RefObject<HTMLVideoElement | null>, enabled: boolean) {
  const modelRef = useRef<blazeface.BlazeFaceModel | null>(null);
  const loopIdRef = useRef<number | null>(null);
  const [signals, setSignals] = useState<FaceSignal>({
    missingFace: false,
    multipleFaces: false,
    confidence: 0,
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let active = true;

    async function initDetector() {
      await tf.ready();
      modelRef.current = await blazeface.load();

      const tick = async () => {
        if (!active || !modelRef.current || !videoRef.current) {
          loopIdRef.current = window.setTimeout(tick, 900) as unknown as number;
          return;
        }

        try {
          const faces = await modelRef.current.estimateFaces(videoRef.current, false);
          setSignals({
            missingFace: faces.length === 0,
            multipleFaces: faces.length > 1,
            confidence: faces.length > 0 ? 1 : 0,
          });
        } catch {
          setSignals({ missingFace: false, multipleFaces: false, confidence: 0 });
        }

        loopIdRef.current = window.setTimeout(tick, 1100) as unknown as number;
      };

      loopIdRef.current = window.setTimeout(tick, 1100) as unknown as number;
    }

    void initDetector();

    return () => {
      active = false;
      if (loopIdRef.current) {
        window.clearTimeout(loopIdRef.current);
      }
      modelRef.current = null;
    };
  }, [enabled, videoRef]);

  return signals;
}
