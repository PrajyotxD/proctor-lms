"use client";

import { useRef, useState } from "react";
import { createWorker } from "tesseract.js";

export function Scratchpad() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [ocrText, setOcrText] = useState("");
  const [busy, setBusy] = useState(false);

  function drawPoint(clientX: number, clientY: number) {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#111827";
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  }

  async function runOcr() {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    setBusy(true);
    const worker = await createWorker("eng");
    const { data } = await worker.recognize(canvas);
    await worker.terminate();
    setOcrText(data.text.trim());
    setBusy(false);
  }

  function clearPad() {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setOcrText("");
  }

  return (
    <section className="rounded-xl border p-3">
      <h3 className="mb-2 text-sm font-medium">Scratchpad + OCR</h3>
      <canvas
        ref={canvasRef}
        width={520}
        height={220}
        className="w-full rounded border bg-white"
        onMouseDown={(e) => {
          setDrawing(true);
          drawPoint(e.clientX, e.clientY);
        }}
        onMouseMove={(e) => drawing && drawPoint(e.clientX, e.clientY)}
        onMouseUp={() => {
          setDrawing(false);
          canvasRef.current?.getContext("2d")?.beginPath();
        }}
        onMouseLeave={() => {
          setDrawing(false);
          canvasRef.current?.getContext("2d")?.beginPath();
        }}
      />
      <div className="mt-2 flex gap-2">
        <button type="button" onClick={runOcr} className="rounded border px-2 py-1 text-xs" disabled={busy}>
          {busy ? "Reading..." : "Convert to text"}
        </button>
        <button type="button" onClick={clearPad} className="rounded border px-2 py-1 text-xs">
          Clear
        </button>
      </div>
      <textarea value={ocrText} readOnly className="mt-2 min-h-20 w-full rounded border p-2 text-xs" placeholder="OCR output appears here" />
    </section>
  );
}
