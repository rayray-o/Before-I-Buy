"use client";

import { useMemo, useRef, useState } from "react";
import { PiggyBank, ListChecks, Archive as ArchiveIcon } from "lucide-react";
import { Alternative, ObjectionTag, PurchaseItem, ResolutionReason } from "@/lib/types";
import { computeStats } from "@/lib/utils";
import { INITIAL_ITEMS } from "@/lib/mockData";

import StatsLedger from "@/components/StatsLedger";
import AddPurchaseForm from "@/components/AddPurchaseForm";
import Registry from "@/components/Registry";
import Archive from "@/components/Archive";
import DetailDrawer from "@/components/DetailDrawer";
import Toast from "@/components/Toast";
import Confetti from "@/components/Confetti";

type Tab = "registry" | "archive";
type ToastState = { message: string; tone?: "sage" | "coral" | "ink" } | null;

export default function Home() {
  const [items, setItems] = useState<PurchaseItem[]>(INITIAL_ITEMS);
  const [tab, setTab] = useState<Tab>("registry");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [votedItemIds, setVotedItemIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<ToastState>(null);
  const [confettiActive, setConfettiActive] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  const stats = useMemo(() => computeStats(items), [items]);
  const registryItems = useMemo(
    () => items.filter((i) => i.status === "cooling").sort((a, b) => a.createdAt - b.createdAt),
    [items]
  );
  const archiveItems = useMemo(() => items.filter((i) => i.status !== "cooling"), [items]);
  const selectedItem = useMemo(
    () => items.find((i) => i.id === selectedId) ?? null,
    [items, selectedId]
  );

  function showToast(message: string, tone: "sage" | "coral" | "ink" = "ink") {
    setToast({ message, tone });
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 3200);
  }

  function handleAddItem(item: PurchaseItem) {
    setItems((prev) => [item, ...prev]);
    showToast(`"${item.name}" is now in its cooling-off period.`, "ink");
  }

  function handleVote(itemId: string, choice: "buy" | "dont-buy", tags: ObjectionTag[]) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId ? { ...i, votes: [...i.votes, { choice, tags }] } : i
      )
    );
    setVotedItemIds((prev) => new Set(prev).add(itemId));
    showToast("Vote recorded — thanks for weighing in.", "ink");
  }

  function handleAddAlternative(itemId: string, alt: Alternative) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId ? { ...i, alternatives: [alt, ...i.alternatives] } : i
      )
    );
    showToast("Alternative added to the listing.", "ink");
  }

  function handleResolve(
    itemId: string,
    status: "saved" | "bought",
    reason?: ResolutionReason
  ) {
    const item = items.find((i) => i.id === itemId);
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              status,
              resolution: {
                reason: reason ?? "Other",
                resolvedAt: Date.now(),
              },
            }
          : i
      )
    );

    if (status === "saved") {
      setConfettiActive(true);
      window.setTimeout(() => setConfettiActive(false), 2800);
      showToast(
        item ? `Nice work — you just saved on the ${item.name}.` : "Saved!",
        "sage"
      );
    } else {
      showToast(
        item ? `Logged: ${item.name} moved to your archive.` : "Purchase confirmed.",
        "coral"
      );
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Brand header */}
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-ink text-paper-50 p-2.5">
            <PiggyBank size={22} strokeWidth={2} />
          </div>
          <div>
            <h1 className="font-display italic text-2xl sm:text-3xl text-ink leading-none">
              Before I Buy
            </h1>
            <p className="text-xs sm:text-sm text-ink-light mt-1">
              Pause the cart. Let time and the crowd decide.
            </p>
          </div>
        </div>
      </header>

      {/* Ledger stats */}
      <StatsLedger
        totalDelayed={stats.totalDelayed}
        totalSaved={stats.totalSaved}
        activeCount={stats.activeCount}
      />

      {/* Add purchase */}
      <AddPurchaseForm onAdd={handleAddItem} />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-line">
        <button
          onClick={() => setTab("registry")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
            tab === "registry"
              ? "border-ink text-ink"
              : "border-transparent text-ink-faint hover:text-ink-light"
          }`}
        >
          <ListChecks size={15} />
          Cooling Off
          <span className="ledger-num text-xs bg-paper-200 rounded-full px-1.5 py-0.5">
            {registryItems.length}
          </span>
        </button>
        <button
          onClick={() => setTab("archive")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
            tab === "archive"
              ? "border-ink text-ink"
              : "border-transparent text-ink-faint hover:text-ink-light"
          }`}
        >
          <ArchiveIcon size={15} />
          Archive
          <span className="ledger-num text-xs bg-paper-200 rounded-full px-1.5 py-0.5">
            {archiveItems.length}
          </span>
        </button>
      </div>

      {/* Main content */}
      {tab === "registry" ? (
        <Registry items={registryItems} onOpen={setSelectedId} />
      ) : (
        <Archive items={archiveItems} onOpen={setSelectedId} />
      )}

      <footer className="pt-6 pb-2 text-center">
        <p className="text-xs text-ink-faint">
          Before I Buy — a cooling-off ledger. Nothing here connects to a real
          store or payment method; the only thing at stake is your own money.
        </p>
      </footer>

      {/* Detail drawer */}
      {selectedItem && (
        <DetailDrawer
          item={selectedItem}
          hasVoted={votedItemIds.has(selectedItem.id)}
          onClose={() => setSelectedId(null)}
          onVote={handleVote}
          onAddAlternative={handleAddAlternative}
          onResolve={handleResolve}
        />
      )}

      <Confetti active={confettiActive} />
      <Toast message={toast?.message ?? null} tone={toast?.tone} onDismiss={() => setToast(null)} />
    </main>
  );
}
