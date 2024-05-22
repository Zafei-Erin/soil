import { NumberInput } from "@/components/NumberInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLiquidate } from "@/hooks/useLiquidate";
import { DaiIcon, WethIcon } from "@/icons";
import { cn } from "@/lib/utils";
import { DepositToken } from "@/constants/token";
import { useState } from "react";

export type LiquidateInfo = {
  userAddress: string;
  collateral: DepositToken;
  soilAmount: number;
};

const DEFAULT_INFO: LiquidateInfo = {
  userAddress: "",
  collateral: "WETH",
  soilAmount: 0,
};

export function LiquidateCard() {
  const [info, setInfo] = useState<LiquidateInfo>(DEFAULT_INFO);
  const { liquidate } = useLiquidate();
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Liquidate</CardTitle>
        <CardDescription>
          By repaying sOIL for borrowers, liquidators receive extra bonus of
          underlying collaterals.
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-4">
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex items-center justify-center gap-6 mb-2">
              <div
                className={cn(
                  "border rounded-lg aspect-square w-fit p-2 hover:-translate-y-2 hover:shadow-lg transition-all",
                  info.collateral == "WETH" && "border-2 border-gray-700"
                )}
                onClick={() =>
                  setInfo((prev) => ({ ...prev, collateral: "WETH" }))
                }
              >
                <WethIcon className="w-16 h-16" />
              </div>
              <div
                className={cn(
                  "border rounded-lg aspect-square w-fit p-2 hover:-translate-y-2 hover:shadow-lg transition-all",
                  info.collateral == "DAI" && "border-2 border-yellow-500"
                )}
                onClick={() =>
                  setInfo((prev) => ({ ...prev, collateral: "DAI" }))
                }
              >
                <DaiIcon className="w-16 h-16" />
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="userAddress">User Address</label>
              <input
                id="userAddress"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm appearance-none placeholder:text-muted-foreground focus-visible:outline-none"
                placeholder="Address to liquidate from"
                onChange={(e) =>
                  setInfo((prev) => ({ ...prev, userAddress: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="soilAmount">sOIL Amount</label>
              <NumberInput
                id="soilAmount"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm appearance-none placeholder:text-muted-foreground focus-visible:outline-none"
                placeholder="Number of sOIL to be covered"
                onAmountChange={(amount) =>
                  setInfo((prev) => ({ ...prev, soilAmount: amount }))
                }
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between mt-6">
        <Button
          className="w-full"
          onClick={() => {
            liquidate(info);
          }}
        >
          Liquidate
        </Button>
      </CardFooter>
    </Card>
  );
}
