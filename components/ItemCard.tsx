"use client";

import { useEffect, useState } from "react";
import { PurchaseItem } from "@/lib/types";
import { formatCurrency, formatTimeRemaining, getTimeRemaining, getSentiment } from "@/lib/utils";
import { CATEGORY_META } from "@/lib/categoryMeta";
import ProgressRing from "./ProgressRing";
import SentimentBar from "./SentimentBar";
import { CheckCircle2 } from "lucide-react";

interface ItemCardProps {
  item: PurchaseItem;
  onOpen: (id: string) => void;
}

export default function ItemCard({ item, onOpen }: ItemCardProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000 * 30);
    return () => clearInterval(id);
  }, []);

  const t = getTimeRemaining(item, now);
  const sentiment = getSentiment(item.votes);
  const meta = CATEGORY_META[item.category];
  const isUrgent = !t.isExpired && t.totalMs < 1000 * 60 * 60 * 24;

  return (
    <button
      onClick={() => onOpen(item.id)}
      className="card-surface text-left w-full p-5 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${meta.className}`}
          >
            <meta.icon size={12} />
            {item.category}
          </span>
          <h3 className="font-display italic text-lg text-ink mt-2.5 leading-snug line-clamp-2 group-hover:text-coral-600 transition-colors">
            {item.name}
          </h3>
        </div>
        <ProgressRing
          progressPct={t.progressPct}
          size={54}
          strokeWidth={4}
          isExpired={t.isExpired}
          isUrgent={isUrgent}
        >
          {t.isExpired ? (
            <CheckCircle2 size={20} className="text-sage-500" />
          ) : (
            <span className="ledger-num text-[10px] font-semibold text-ink text-center leading-tight">
              {t.days > 0 ? `${t.days}d` : `${t.hours}h`}
            </span>
          )}
        </ProgressRing>
      </div>

      <p className="ledger-num text-2xl font-medium text-ink">
        {formatCurrency(item.price)}
      </p>

      <p className="text-sm text-ink-light leading-relaxed line-clamp-2 italic">
        &ldquo;{item.note}&rdquo;
      </p>

      <div className="receipt-dots" />

      <div className="flex items-center justify-between gap-3">
        <span
          className={`text-xs font-medium ${
            t.isExpired ? "text-sage-600" : isUrgent ? "text-coral-500" : "text-ink-light"
          }`}
        >
          {formatTimeRemaining(t)}
        </span>
        <span className="text-xs text-ink-faint">
          {sentiment.total} vote{sentiment.total === 1 ? "" : "s"}
        </span>
      </div>

      <SentimentBar
        buyPct={sentiment.buyPct}
        dontBuyPct={sentiment.dontBuyPct}
        total={sentiment.total}
      />
    </button>
  );
}
