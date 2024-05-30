import { useEffect } from "react";

import { cn } from "@/lib/utils";
import { useHealthFactor } from "@/provider";

type State = "Init" | "BROKE" | "Risky" | "Moderate" | "Healthy";

export const HealthFactor = () => {
  const { healthFactor } = useHealthFactor();
  const state: State =
    healthFactor == 0
      ? "Init"
      : healthFactor < 1
        ? "BROKE"
        : healthFactor < 2
          ? "Risky"
          : healthFactor < 3
            ? "Moderate"
            : "Healthy";
  const textColor: string =
    state == "Init"
      ? "text-gray-400/80"
      : state == "BROKE"
        ? "text-red-600/80"
        : state == "Risky"
          ? "text-amber-600/80"
          : state == "Moderate"
            ? "text-amber-400/80"
            : "text-emerald-600/80";

  const bgColor: string =
    state == "Init"
      ? "bg-gray-400/80"
      : state == "BROKE"
        ? "bg-red-600/80"
        : state == "Risky"
          ? "bg-amber-600/80"
          : state == "Moderate"
            ? "bg-amber-400/80"
            : "bg-emerald-600/80";

  const width = Math.min(healthFactor, 5) * 20;

  useEffect(() => {}, [healthFactor]);
  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-2xl font-semibold">Health Factor</h1>
        <p className="text-xs text-gray-400">
          If the health factor drops below 1, the liquidation of your collateral
          might be triggered.
        </p>
      </div>

      <div className="flex items-end justify-between">
        <div className={cn("text-4xl font-semibold text-gray-400", textColor)}>
          {healthFactor.toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
        </div>
        {state != "Init" && (
          <span className={cn("text-lg text-gray-400", textColor)}>
            {state}
          </span>
        )}
      </div>
      <div className={cn("h-3 w-full rounded-full bg-gray-600")}>
        <div
          className={cn("h-full rounded-full", bgColor)}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};
