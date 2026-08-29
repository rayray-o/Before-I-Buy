import { Category, PurchaseItem, Vote } from "./types";

export function genId(prefix = "item"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  });
}

export interface TimeRemaining {
  totalMs: number;
  isExpired: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  progressPct: number; // 0 - 100, how much of the cooling period has ELAPSED
}

export function getTimeRemaining(item: PurchaseItem, now: number): TimeRemaining {
  const endTime = item.createdAt + item.coolingHours * 60 * 60 * 1000;
  const totalMs = Math.max(0, endTime - now);
  const totalDuration = item.coolingHours * 60 * 60 * 1000;
  const elapsed = Math.min(totalDuration, Math.max(0, now - item.createdAt));
  const progressPct = totalDuration === 0 ? 100 : (elapsed / totalDuration) * 100;

  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((totalMs / (1000 * 60)) % 60);
  const seconds = Math.floor((totalMs / 1000) % 60);

  return {
    totalMs,
    isExpired: totalMs <= 0,
    days,
    hours,
    minutes,
    seconds,
    progressPct: Math.min(100, Math.max(0, progressPct)),
  };
}

export function formatTimeRemaining(t: TimeRemaining): string {
  if (t.isExpired) return "Cooling period complete";
  if (t.days > 0) return `${t.days}d ${t.hours}h left`;
  if (t.hours > 0) return `${t.hours}h ${t.minutes}m left`;
  if (t.minutes > 0) return `${t.minutes}m ${t.seconds}s left`;
  return `${t.seconds}s left`;
}

export function getSentiment(votes: Vote[]): {
  buyPct: number;
  dontBuyPct: number;
  total: number;
  topTags: { tag: string; count: number }[];
} {
  const total = votes.length;
  if (total === 0) {
    return { buyPct: 50, dontBuyPct: 50, total: 0, topTags: [] };
  }
  const buyCount = votes.filter((v) => v.choice === "buy").length;
  const dontBuyCount = total - buyCount;

  const tagCounts = new Map<string, number>();
  votes.forEach((v) => {
    v.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  const topTags = Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return {
    buyPct: Math.round((buyCount / total) * 100),
    dontBuyPct: Math.round((dontBuyCount / total) * 100),
    total,
    topTags,
  };
}

export const CATEGORY_LIST: Category[] = [
  "Tech & Gadgets",
  "Fashion & Apparel",
  "Home & Decor",
  "Beauty",
  "Hobby & Gaming",
  "Fitness & Outdoors",
  "Other",
];

export function hoursAgo(hours: number): number {
  return Date.now() - hours * 60 * 60 * 1000;
}

export const OBJECTION_TAGS: import("./types").ObjectionTag[] = [
  "Hype Train",
  "Overpriced",
  "You already own this",
  "Hidden Fees",
  "Fast Fashion",
  "Will collect dust",
  "Better alt exists",
];

export const RESOLUTION_REASONS: import("./types").ResolutionReason[] = [
  "Price dropped, felt urgent",
  "Saw someone else with it",
  "Stressful day, wanted comfort",
  "Ran out of patience",
  "It's genuinely useful",
  "Gift for someone else",
  "Other",
];

export const ALT_TYPES: import("./types").Alternative["type"][] = [
  "Cheaper Link",
  "DIY Option",
  "Will Lend Mine",
];

export const COOLING_PRESETS: { label: string; hours: number }[] = [
  { label: "24 hours", hours: 24 },
  { label: "3 days", hours: 3 * 24 },
  { label: "7 days", hours: 7 * 24 },
  { label: "14 days", hours: 14 * 24 },
  { label: "30 days", hours: 30 * 24 },
];

export function computeStats(items: PurchaseItem[]) {
  const cooling = items.filter((i) => i.status === "cooling");
  const saved = items.filter((i) => i.status === "saved");
  const bought = items.filter((i) => i.status === "bought");

  return {
    totalDelayed: items.reduce((sum, i) => sum + i.price, 0),
    totalSaved: saved.reduce((sum, i) => sum + i.price, 0),
    totalBlown: bought.reduce((sum, i) => sum + i.price, 0),
    activeCount: cooling.length,
    savedCount: saved.length,
    blownCount: bought.length,
  };
}
