import { useHealthFactor } from "@/hooks/useHealthFactor";
import { cn } from "@/lib/utils";

type State = "INIT" | "BROKE" | "DANGER" | "SAFE";

export const HealthFactor = () => {
  const { healthFactor } = useHealthFactor();
  const state: State =
    healthFactor == 0
      ? "INIT"
      : healthFactor < 1
      ? "BROKE"
      : healthFactor < 3
      ? "DANGER"
      : "SAFE";
  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-2xl font-semibold">Health Factor</h1>
        <p className="text-xs text-gray-600">
          If the health factor drops below 1, the liquidation of your collateral
          might be triggered.
        </p>
      </div>
      <div
        className={cn(
          "text-4xl text-gray-600 font-semibold",
          state == "INIT"
            ? "text-gray-600/80"
            : state == "BROKE"
            ? "text-red-600/80"
            : state == "DANGER"
            ? " text-amber-600/80"
            : " text-emerald-600/80"
        )}
      >
        {healthFactor.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })}
      </div>
    </div>
  );
};
