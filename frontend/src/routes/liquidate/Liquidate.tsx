import { UpdateSoilPriceComponent } from "@/components/UpdateSoilPriceComponent/UpdateSoilPriceComponent";
import { LiquidateCard } from "./LiquidateCard";

export function Liquidate() {
  return (
    <div className="flex items-center justify-center h-fit w-full">
      <div className="max-w-3xl px-6 space-y-3 pt-16 pb-36">
        <UpdateSoilPriceComponent />
        <LiquidateCard />
      </div>
    </div>
  );
}
