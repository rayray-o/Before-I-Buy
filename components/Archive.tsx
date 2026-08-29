"use client";

import { PurchaseItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { CATEGORY_META } from "@/lib/categoryMeta";
import { PartyPopper, Frown, Archive as ArchiveIcon } from "lucide-react";

interface ArchiveProps {
  items: PurchaseItem[];
  onOpen: (id: string) => void;
}

export default function Archive({ items, onOpen }: ArchiveProps) {
  if (items.length === 0) {
    return (
      <div className="card-surface flex flex-col items-center justify-center text-center py-16 px-6">
        <div className="rounded-full bg-paper-200 p-4 mb-4">
          <ArchiveIcon size={24} className="text-ink-faint" />
        </div>
        <h3 className="font-display italic text-xl text-ink mb-1">
          The archive is empty
        </h3>
        <p className="text-sm text-ink-light max-w-sm">
          Once a cooling-off period is resolved — saved or blown — it lands
          here as a permanent record.
        </p>
      </div>
    );
  }

  const sorted = [...items].sort(
    (a, b) => (b.resolution?.resolvedAt ?? 0) - (a.resolution?.resolvedAt ?? 0)
  );

  return (
    <div className="card-surface divide-y divide-line overflow-hidden">
      {sorted.map((item) => {
        const meta = CATEGORY_META[item.category];
        const saved = item.status === "saved";
        return (
          <button
            key={item.id}
            onClick={() => onOpen(item.id)}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-paper-100 transition-colors text-left"
          >
            <div
              className={`shrink-0 rounded-full p-2.5 ${
                saved ? "bg-sage-50 text-sage-600" : "bg-coral-50 text-coral-500"
              }`}
            >
              {saved ? <PartyPopper size={17} /> : <Frown size={17} />}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-ink text-sm truncate">{item.name}</p>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0 ${meta.className}`}
                >
                  <meta.icon size={10} />
                  {item.category}
                </span>
              </div>
              <p className="text-xs text-ink-faint mt-0.5 truncate">
                {item.resolution?.reason ?? "—"}
              </p>
            </div>

            <p
              className={`ledger-num text-base font-semibold shrink-0 ${
                saved ? "text-sage-600" : "text-coral-500"
              }`}
            >
              {saved ? "+" : "−"}
              {formatCurrency(item.price)}
            </p>
          </button>
        );
      })}
    </div>
  );
}
