"use client";

import { useEffect, useRef, useState } from "react";
import { PiggyBank, Clock3, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

function useCountUp(target: number, durationMs = 900) {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(0);

  useEffect(() => {
    fromRef.current = value;
    startRef.current = null;
    let raf: number;

    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const elapsed = t - startRef.current;
      const pct = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - pct, 3);
      setValue(fromRef.current + (target - fromRef.current) * eased);
      if (pct < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}

interface StatsLedgerProps {
  totalDelayed: number;
  totalSaved: number;
  activeCount: number;
}

export default function StatsLedger({
  totalDelayed,
  totalSaved,
  activeCount,
}: StatsLedgerProps) {
  const delayedAnim = useCountUp(totalDelayed);
  const savedAnim = useCountUp(totalSaved);
  const activeAnim = useCountUp(activeCount, 600);

  const stats = [
    {
      label: "Total Delayed Spent",
      value: formatCurrency(delayedAnim),
      icon: Clock3,
      accent: "text-ink",
    },
    {
      label: "Total Money Saved",
      value: formatCurrency(savedAnim),
      icon: PiggyBank,
      accent: "text-sage-600",
    },
    {
      label: "Active Cooling-Off Items",
      value: Math.round(activeAnim).toString(),
      icon: Wallet,
      accent: "text-coral-500",
    },
  ];

  return (
    <div className="card-surface px-5 py-5 sm:px-8 sm:py-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-0">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`flex items-center gap-3.5 sm:px-6 ${
              i > 0 ? "sm:border-l sm:border-line" : ""
            } ${i === 0 ? "sm:pl-0" : ""}`}
          >
            <div className={`shrink-0 rounded-full p-2.5 bg-paper-200 ${s.accent}`}>
              <s.icon size={18} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wider text-ink-faint font-medium">
                {s.label}
              </p>
              <p className={`ledger-num text-2xl sm:text-[26px] font-medium ${s.accent} truncate`}>
                {s.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
