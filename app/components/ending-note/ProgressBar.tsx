"use client";

interface ProgressBarProps {
  /** 0〜100 */
  progress: number;
  /** ラベル（省略時は「現在の完成度」） */
  label?: string;
}

export default function ProgressBar({ progress, label = "現在の完成度" }: ProgressBarProps) {
  const value = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={`${label}: ${value}%`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-foreground/80">{label}</span>
        <span className="text-sm font-bold text-primary tabular-nums">{value}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
