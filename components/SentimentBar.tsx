"use client";

interface SentimentBarProps {
  buyPct: number;
  dontBuyPct: number;
  total: number;
  size?: "sm" | "md";
}

export default function SentimentBar({
  buyPct,
  dontBuyPct,
  total,
  size = "sm",
}: SentimentBarProps) {
  const height = size === "sm" ? "h-1.5" : "h-2.5";

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5 text-xs">
        <span className="font-medium text-coral-500">
          {dontBuyPct}% Don&rsquo;t Buy
        </span>
        <span className="font-medium text-sage-600">{buyPct}% Buy</span>
      </div>
      <div className={`w-full ${height} rounded-full overflow-hidden bg-line flex`}>
        <div
          className="h-full bg-coral-400 transition-all duration-500 ease-out"
          style={{ width: `${dontBuyPct}%` }}
        />
        <div
          className="h-full bg-sage-400 transition-all duration-500 ease-out"
          style={{ width: `${buyPct}%` }}
        />
      </div>
      {total === 0 && (
        <p className="text-[11px] text-ink-faint mt-1">
          No community votes yet — be the first.
        </p>
      )}
    </div>
  );
}
