"use client";

import { BOX_COLORS, BOX_LABELS } from "@/lib/constants";
import { clsx } from "clsx";

interface LeitnerBoxIndicatorProps {
  currentBox: number;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export default function LeitnerBoxIndicator({
  currentBox,
  showLabel = false,
  size = "sm",
}: LeitnerBoxIndicatorProps) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((box) => (
        <div
          key={box}
          className={clsx(
            "rounded-sm transition-all",
            size === "sm" ? "w-3 h-3" : "w-4 h-4",
            box === currentBox
              ? `${BOX_COLORS[box]} ring-2 ring-offset-1 ring-gray-400`
              : box <= currentBox
                ? BOX_COLORS[box]
                : "bg-gray-200"
          )}
          title={`Box ${box}: ${BOX_LABELS[box]}`}
        />
      ))}
      {showLabel && (
        <span className="text-xs text-gray-500 ml-1">
          {BOX_LABELS[currentBox]}
        </span>
      )}
    </div>
  );
}
