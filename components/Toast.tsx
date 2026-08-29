"use client";

import { CheckCircle2, X } from "lucide-react";

interface ToastProps {
  message: string | null;
  tone?: "sage" | "coral" | "ink";
  onDismiss: () => void;
}

export default function Toast({ message, tone = "sage", onDismiss }: ToastProps) {
  if (!message) return null;

  const toneClasses =
    tone === "sage"
      ? "bg-sage-600 text-paper-50"
      : tone === "coral"
      ? "bg-coral-500 text-paper-50"
      : "bg-ink text-paper-50";

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[110] animate-slide-up px-4 w-full max-w-sm sm:max-w-md">
      <div
        className={`flex items-center gap-2.5 rounded-full shadow-lg px-4 py-3 ${toneClasses}`}
      >
        <CheckCircle2 size={17} className="shrink-0" />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="shrink-0 opacity-80 hover:opacity-100 transition-opacity"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
