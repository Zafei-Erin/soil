import { UpdateSoilPriceComponent } from "@/components";
import { LiquidateCard } from "./LiquidateCard";

export function Liquidate() {
  return (
    <div className="flex h-fit w-full items-center justify-center">
      <div className="max-w-3xl space-y-3 px-6 pb-36 pt-16">
        <UpdateSoilPriceComponent />
        <LiquidateCard />
      </div>
    </div>
  );
}
