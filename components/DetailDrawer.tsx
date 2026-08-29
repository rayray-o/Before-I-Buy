"use client";

import { useEffect, useState } from "react";
import {
  X,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Link2,
  AlertTriangle,
  PartyPopper,
  Frown,
  Lightbulb,
  Wrench,
  Coins,
  Handshake,
  Tag as TagIcon,
} from "lucide-react";
import { Alternative, ObjectionTag, PurchaseItem, ResolutionReason } from "@/lib/types";
import {
  formatCurrency,
  formatTimeRemaining,
  getTimeRemaining,
  getSentiment,
  OBJECTION_TAGS,
  RESOLUTION_REASONS,
  ALT_TYPES,
  genId,
} from "@/lib/utils";
import { CATEGORY_META } from "@/lib/categoryMeta";
import ProgressRing from "./ProgressRing";
import SentimentBar from "./SentimentBar";

interface DetailDrawerProps {
  item: PurchaseItem;
  hasVoted: boolean;
  onClose: () => void;
  onVote: (itemId: string, choice: "buy" | "dont-buy", tags: ObjectionTag[]) => void;
  onAddAlternative: (itemId: string, alt: Alternative) => void;
  onResolve: (itemId: string, status: "saved" | "bought", reason?: ResolutionReason) => void;
}

const ALT_TYPE_META: Record<Alternative["type"], { icon: typeof Wrench; label: string }> = {
  "Cheaper Link": { icon: Coins, label: "Cheaper Link" },
  "DIY Option": { icon: Wrench, label: "DIY Option" },
  "Will Lend Mine": { icon: Handshake, label: "Will Lend Mine" },
};

export default function DetailDrawer({
  item,
  hasVoted,
  onClose,
  onVote,
  onAddAlternative,
  onResolve,
}: DetailDrawerProps) {
  const [now, setNow] = useState(() => Date.now());
  const [voteChoice, setVoteChoice] = useState<"buy" | "dont-buy" | null>(null);
  const [selectedTags, setSelectedTags] = useState<ObjectionTag[]>([]);

  const [showAltForm, setShowAltForm] = useState(false);
  const [altType, setAltType] = useState<Alternative["type"]>("Cheaper Link");
  const [altDesc, setAltDesc] = useState("");
  const [altUrl, setAltUrl] = useState("");
  const [altAuthor, setAltAuthor] = useState("You");

  const [confirmAction, setConfirmAction] = useState<"blowIt" | "grew" | null>(null);
  const [blowReason, setBlowReason] = useState<ResolutionReason | "">("");

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const t = getTimeRemaining(item, now);
  const sentiment = getSentiment(item.votes);
  const meta = CATEGORY_META[item.category];
  const isUrgent = !t.isExpired && t.totalMs < 1000 * 60 * 60 * 24;

  function toggleTag(tag: ObjectionTag) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]
    );
  }

  function submitVote() {
    if (!voteChoice) return;
    onVote(item.id, voteChoice, voteChoice === "dont-buy" ? selectedTags : []);
    setVoteChoice(null);
    setSelectedTags([]);
  }

  function submitAlternative(e: React.FormEvent) {
    e.preventDefault();
    if (!altDesc.trim()) return;
    const alt: Alternative = {
      id: genId("alt"),
      authorName: altAuthor.trim() || "You",
      type: altType,
      description: altDesc.trim(),
      url: altUrl.trim() || undefined,
      createdAt: Date.now(),
    };
    onAddAlternative(item.id, alt);
    setAltDesc("");
    setAltUrl("");
    setShowAltForm(false);
  }

  function handleBlowItConfirm() {
    if (!blowReason) return;
    onResolve(item.id, "bought", blowReason as ResolutionReason);
  }

  function handleGrewConfirm() {
    onResolve(item.id, "saved");
  }

  const isResolved = item.status !== "cooling";

  return (
    <div className="fixed inset-0 z-[90]">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] animate-fade-in"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[480px] md:w-[560px] max-w-full bg-paper-50 shadow-2xl animate-slide-in-right overflow-y-auto">
        <div className="sticky top-0 z-10 bg-paper-50/95 backdrop-blur border-b border-line px-5 sm:px-6 py-4 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${meta.className}`}
          >
            <meta.icon size={12} />
            {item.category}
          </span>
          <button
            onClick={onClose}
            aria-label="Close detail panel"
            className="rounded-full p-2 hover:bg-paper-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 sm:px-6 py-6 space-y-8">
          {/* Header */}
          <div>
            <h2 className="font-display italic text-2xl sm:text-[28px] text-ink leading-snug">
              {item.name}
            </h2>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-ink-light hover:text-coral-600 mt-1.5 transition-colors"
              >
                View original listing <ExternalLink size={11} />
              </a>
            )}

            <div className="flex items-center justify-between mt-5 gap-4">
              <p className="ledger-num text-4xl font-medium text-ink">
                {formatCurrency(item.price)}
              </p>
              <ProgressRing
                progressPct={t.progressPct}
                size={72}
                strokeWidth={5}
                isExpired={t.isExpired}
                isUrgent={isUrgent}
              >
                <span className="ledger-num text-[11px] font-semibold text-ink text-center leading-tight">
                  {t.isExpired ? "Done" : t.days > 0 ? `${t.days}d` : `${t.hours}h`}
                </span>
              </ProgressRing>
            </div>
            <p
              className={`text-sm font-medium mt-2 ${
                t.isExpired ? "text-sage-600" : isUrgent ? "text-coral-500" : "text-ink-light"
              }`}
            >
              {formatTimeRemaining(t)}
            </p>
          </div>

          {/* Rationalization note */}
          <div className="rounded-2xl bg-paper-200/60 border border-line px-4 py-4">
            <p className="text-[11px] uppercase tracking-wide text-ink-faint font-medium mb-1.5">
              Why I think I need this
            </p>
            <p className="text-sm text-ink leading-relaxed italic">&ldquo;{item.note}&rdquo;</p>
          </div>

          {isResolved ? (
            <div
              className={`rounded-2xl border px-4 py-4 flex items-start gap-3 ${
                item.status === "saved"
                  ? "bg-sage-50 border-sage-200"
                  : "bg-coral-50 border-coral-100"
              }`}
            >
              {item.status === "saved" ? (
                <PartyPopper size={20} className="text-sage-600 shrink-0 mt-0.5" />
              ) : (
                <Frown size={20} className="text-coral-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`text-sm font-semibold ${item.status === "saved" ? "text-sage-700" : "text-coral-700"}`}>
                  {item.status === "saved" ? "Saved — resisted the urge" : "Bought — cooling period broken"}
                </p>
                {item.resolution && (
                  <p className="text-xs text-ink-light mt-0.5">Reason: {item.resolution.reason}</p>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Community Gatekeeping */}
              <div>
                <h3 className="font-display italic text-lg text-ink mb-3">
                  Community gatekeeping
                </h3>

                <SentimentBar
                  buyPct={sentiment.buyPct}
                  dontBuyPct={sentiment.dontBuyPct}
                  total={sentiment.total}
                  size="md"
                />

                {sentiment.topTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {sentiment.topTags.map((t) => (
                      <span
                        key={t.tag}
                        className="inline-flex items-center gap-1 rounded-full bg-paper-200 text-ink-light text-[11px] px-2.5 py-1"
                      >
                        <TagIcon size={10} />
                        {t.tag} · {t.count}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-5">
                  {hasVoted ? (
                    <p className="text-sm text-ink-light bg-paper-200/60 rounded-xl px-3.5 py-3">
                      You&rsquo;ve already voted on this item — thanks for weighing in.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setVoteChoice("buy")}
                          className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all ${
                            voteChoice === "buy"
                              ? "bg-sage-500 border-sage-500 text-paper-50"
                              : "border-line hover:border-sage-400 text-ink-light"
                          }`}
                        >
                          <ThumbsUp size={15} /> Buy it
                        </button>
                        <button
                          onClick={() => setVoteChoice("dont-buy")}
                          className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all ${
                            voteChoice === "dont-buy"
                              ? "bg-coral-500 border-coral-500 text-paper-50"
                              : "border-line hover:border-coral-400 text-ink-light"
                          }`}
                        >
                          <ThumbsDown size={15} /> Don&rsquo;t buy
                        </button>
                      </div>

                      {voteChoice === "dont-buy" && (
                        <div className="animate-fade-in">
                          <p className="text-xs text-ink-light mb-2">
                            What&rsquo;s the objection? (optional, pick any)
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {OBJECTION_TAGS.map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => toggleTag(tag)}
                                className={`rounded-full px-2.5 py-1 text-[11px] font-medium border transition-all ${
                                  selectedTags.includes(tag)
                                    ? "bg-ink text-paper-50 border-ink"
                                    : "bg-paper-50 text-ink-light border-line hover:border-ink-faint"
                                }`}
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {voteChoice && (
                        <button
                          onClick={submitVote}
                          className="w-full rounded-xl bg-ink text-paper-50 text-sm font-semibold py-2.5 hover:bg-ink-light transition-colors animate-fade-in"
                        >
                          Submit vote
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="receipt-dots" />

              {/* Alternatives */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display italic text-lg text-ink">
                    Crowdsourced alternatives
                  </h3>
                  <button
                    onClick={() => setShowAltForm((v) => !v)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-ink-light hover:text-ink transition-colors"
                  >
                    <Plus size={13} /> Suggest one
                  </button>
                </div>

                {item.alternatives.length === 0 && !showAltForm && (
                  <p className="text-sm text-ink-faint italic">
                    No alternatives suggested yet.
                  </p>
                )}

                <div className="space-y-2.5">
                  {item.alternatives.map((alt) => {
                    const altMeta = ALT_TYPE_META[alt.type];
                    return (
                      <div
                        key={alt.id}
                        className="rounded-xl border border-line bg-paper-50 px-3.5 py-3"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-sage-700 bg-sage-50 rounded-full px-2 py-0.5">
                            <altMeta.icon size={11} />
                            {altMeta.label}
                          </span>
                          <span className="text-[11px] text-ink-faint">{alt.authorName}</span>
                        </div>
                        <p className="text-sm text-ink-light leading-relaxed">{alt.description}</p>
                        {alt.url && (
                          <a
                            href={alt.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-coral-600 hover:text-coral-700 mt-1.5 transition-colors"
                          >
                            <Link2 size={11} /> View link
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>

                {showAltForm && (
                  <form
                    onSubmit={submitAlternative}
                    className="mt-3 rounded-xl border border-dashed border-line px-3.5 py-3.5 space-y-3 animate-fade-in"
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {ALT_TYPES.map((type) => {
                        const tMeta = ALT_TYPE_META[type];
                        const active = altType === type;
                        return (
                          <button
                            type="button"
                            key={type}
                            onClick={() => setAltType(type)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border transition-all ${
                              active
                                ? "bg-ink text-paper-50 border-ink"
                                : "bg-paper-50 text-ink-light border-line"
                            }`}
                          >
                            <tMeta.icon size={11} />
                            {type}
                          </button>
                        );
                      })}
                    </div>
                    <textarea
                      value={altDesc}
                      onChange={(e) => setAltDesc(e.target.value)}
                      placeholder="Describe the cheaper option, DIY approach, or offer to lend…"
                      rows={2}
                      className="w-full rounded-lg border border-line bg-paper-50 px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-ink transition-colors resize-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="url"
                        value={altUrl}
                        onChange={(e) => setAltUrl(e.target.value)}
                        placeholder="Link (optional)"
                        className="rounded-lg border border-line bg-paper-50 px-3 py-2 text-xs text-ink placeholder:text-ink-faint focus:border-ink transition-colors"
                      />
                      <input
                        type="text"
                        value={altAuthor}
                        onChange={(e) => setAltAuthor(e.target.value)}
                        placeholder="Your name"
                        className="rounded-lg border border-line bg-paper-50 px-3 py-2 text-xs text-ink placeholder:text-ink-faint focus:border-ink transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-sage-500 hover:bg-sage-600 text-paper-50 text-xs font-semibold py-2 transition-colors"
                    >
                      Add alternative
                    </button>
                  </form>
                )}
              </div>

              <div className="receipt-dots" />

              {/* Resolution */}
              <div>
                <h3 className="font-display italic text-lg text-ink mb-3">Resolve this item</h3>

                {!t.isExpired && (
                  <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-100 px-3.5 py-3 mb-4">
                    <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 leading-relaxed">
                      {formatTimeRemaining(t)} — resolving now means breaking your own
                      cooling-off commitment. You can still proceed, with a confirmation.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setConfirmAction("grew")}
                    className="rounded-2xl border-2 border-sage-500 bg-sage-50 hover:bg-sage-100 active:scale-[0.98] px-4 py-4 text-left transition-all"
                  >
                    <PartyPopper size={20} className="text-sage-600 mb-1.5" />
                    <p className="font-semibold text-sage-700 text-sm">I Grew</p>
                    <p className="text-xs text-sage-600/80 mt-0.5">Save the money</p>
                  </button>
                  <button
                    onClick={() => setConfirmAction("blowIt")}
                    className="rounded-2xl border-2 border-coral-400 bg-coral-50 hover:bg-coral-100 active:scale-[0.98] px-4 py-4 text-left transition-all"
                  >
                    <Frown size={20} className="text-coral-500 mb-1.5" />
                    <p className="font-semibold text-coral-700 text-sm">I Blew It</p>
                    <p className="text-xs text-coral-600/80 mt-0.5">Confirm purchase</p>
                  </button>
                </div>

                {confirmAction === "grew" && (
                  <div className="mt-4 rounded-2xl border border-sage-200 bg-sage-50 px-4 py-4 animate-fade-in">
                    <p className="text-sm text-sage-700 font-medium mb-3 flex items-center gap-2">
                      <Lightbulb size={15} /> Nice — lock in {formatCurrency(item.price)} saved?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleGrewConfirm}
                        className="flex-1 rounded-lg bg-sage-500 hover:bg-sage-600 text-paper-50 text-sm font-semibold py-2.5 transition-colors"
                      >
                        Yes, I&rsquo;m proud of this
                      </button>
                      <button
                        onClick={() => setConfirmAction(null)}
                        className="rounded-lg border border-sage-300 text-sage-700 text-sm font-medium px-4 py-2.5 hover:bg-sage-100 transition-colors"
                      >
                        Not yet
                      </button>
                    </div>
                  </div>
                )}

                {confirmAction === "blowIt" && (
                  <div className="mt-4 rounded-2xl border border-coral-200 bg-coral-50 px-4 py-4 animate-fade-in space-y-3">
                    <p className="text-sm text-coral-700 font-medium">
                      What tipped you over the edge?
                    </p>
                    <select
                      value={blowReason}
                      onChange={(e) => setBlowReason(e.target.value as ResolutionReason)}
                      className="w-full rounded-lg border border-coral-200 bg-paper-50 px-3 py-2.5 text-sm text-ink"
                    >
                      <option value="">Select a reason…</option>
                      {RESOLUTION_REASONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={handleBlowItConfirm}
                        disabled={!blowReason}
                        className="flex-1 rounded-lg bg-coral-500 hover:bg-coral-600 disabled:opacity-40 disabled:cursor-not-allowed text-paper-50 text-sm font-semibold py-2.5 transition-colors"
                      >
                        Confirm purchase
                      </button>
                      <button
                        onClick={() => setConfirmAction(null)}
                        className="rounded-lg border border-coral-300 text-coral-700 text-sm font-medium px-4 py-2.5 hover:bg-coral-100 transition-colors"
                      >
                        Wait, cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
