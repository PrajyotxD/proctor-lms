"use client";

import { useMemo, useState } from "react";

type Message = { role: "user" | "assistant"; text: string };

const cannedReplies = [
  "I can help with technical issues only. Try reloading the camera permission prompt if preview is blank.",
  "Time tip: split remaining questions into two passes - first confident answers, then review uncertain ones.",
  "If the exam feels laggy, close extra tabs/apps and keep this tab in foreground for stable proctoring.",
  "I cannot provide answer content, but I can help with navigation and exam controls.",
];

export function StudyBuddy() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi, I am Study Buddy. I can help with technical support and time management during your exam.",
    },
  ]);
  const [draft, setDraft] = useState("");

  const canSend = useMemo(() => draft.trim().length > 0, [draft]);

  function send() {
    if (!canSend) {
      return;
    }

    const text = draft.trim();
    setMessages((prev) => [...prev, { role: "user", text }]);
    setDraft("");

    const lower = text.toLowerCase();
    const response = lower.includes("answer") || lower.includes("solve")
      ? "I cannot help with exam answers. I can assist with technical setup and pacing strategy."
      : cannedReplies[Math.floor(Math.random() * cannedReplies.length)];

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", text: response }]);
    }, 350);
  }

  return (
    <section className="rounded-2xl border border-slate-700/70 bg-[#0b1220] p-3 text-slate-100">
      <h3 className="mb-2 text-sm font-medium">AI Study Buddy</h3>
      <div className="mb-2 max-h-36 space-y-2 overflow-auto rounded-xl border border-slate-700 bg-slate-900/60 p-2 text-xs">
        {messages.map((message, idx) => (
          <p key={`${message.role}-${idx}`} className={message.role === "assistant" ? "text-slate-300" : "text-slate-100"}>
            <span className="font-medium">{message.role === "assistant" ? "Buddy" : "You"}:</span> {message.text}
          </p>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask for technical/time-management help"
          className="w-full rounded-xl border border-slate-600 bg-slate-950/60 px-2 py-1 text-xs text-slate-100"
        />
        <button type="button" onClick={send} className="rounded-xl bg-primary px-2 py-1 text-xs text-primary-foreground">
          Send
        </button>
      </div>
    </section>
  );
}
