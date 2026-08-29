"use client";

interface ProgressRingProps {
  progressPct: number; // 0-100, elapsed
  size?: number;
  strokeWidth?: number;
  isExpired?: boolean;
  isUrgent?: boolean;
  children?: React.ReactNode;
}

export default function ProgressRing({
  progressPct,
  size = 64,
  strokeWidth = 5,
  isExpired = false,
  isUrgent = false,
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progressPct / 100) * circumference;

  const trackColor = "text-line";
  const progressColor = isExpired
    ? "text-sage-500"
    : isUrgent
    ? "text-coral-400"
    : "text-amber-400";

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={
        isExpired
          ? "Cooling-off period complete"
          : `${Math.round(progressPct)} percent of cooling-off period elapsed`
      }
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className={trackColor}
          stroke="currentColor"
          opacity={0.35}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className={`${progressColor} transition-all duration-700 ease-out`}
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
