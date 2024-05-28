import { useState } from "react";

import { ControlledNumberInput } from "@/components/ControlledNumberInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useShowToast } from "@/components/useShowToast";
import { DepositToken } from "@/constants/token";
import { useLiquidate } from "@/hooks/useLiquidate";
import { DaiIcon, Loader, WethIcon } from "@/icons";
import { cn } from "@/lib/utils";
import { useBalances } from "@/provider/balanceProvider";

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
  const [inputs, setInputs] = useState<LiquidateInfo>(DEFAULT_INFO);
  const [loading, setLoading] = useState<boolean>(false);
  const { liquidate } = useLiquidate();
  const { getBalances } = useBalances();
  const { showSuccessToast, showFailToast } = useShowToast();

  const soilBalance = getBalances("SOIL");
  const inValidAmount =
    inputs.soilAmount <= 0 || soilBalance < inputs.soilAmount;
  const inValidAddress =
    inputs.userAddress.length != 0 &&
    (inputs.userAddress.length != 42 || !inputs.userAddress.startsWith("0x"));
  const disabled = loading || inValidAmount || inValidAddress;

  const liquidateWrapped = async () => {
    try {
      await liquidate(inputs);
      showSuccessToast(`You have Liquidate ${inputs.soilAmount} SOIL!`);
    } catch (error) {
      showFailToast(`Failed to Liquidate ${inputs.collateral}`);
    } finally {
      setLoading(false);
      setInputs(DEFAULT_INFO);
    }
  };
  return (
    <Card className="w-full h-full border-0 bg-black-dim font-satoshi">
      <CardHeader>
        <CardTitle>Liquidate</CardTitle>
        <CardDescription>
          By repaying sOIL for borrowers, liquidators receive extra bonus of
          underlying collaterals.
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-4">
        <form onSubmit={liquidateWrapped}>
          <div className="grid w-full items-center gap-4">
            <div className="flex items-center justify-center gap-6 mb-2">
              <div
                className={cn(
                  "border rounded-lg aspect-square w-fit p-2 hover:-translate-y-2 hover:shadow-lg transition-all",
                  inputs.collateral == "WETH" && "border-2 border-gray-300"
                )}
                onClick={() =>
                  setInputs((prev) => ({ ...prev, collateral: "WETH" }))
                }
              >
                <WethIcon className="w-16 h-16" />
              </div>
              <div
                className={cn(
                  "border rounded-lg aspect-square w-fit p-2 hover:-translate-y-2 hover:shadow-lg transition-all",
                  inputs.collateral == "DAI" && "border-2 border-yellow-500"
                )}
                onClick={() =>
                  setInputs((prev) => ({ ...prev, collateral: "DAI" }))
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
                value={inputs.userAddress}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    userAddress: e.target.value,
                  }))
                }
              />
              {inValidAddress && (
                <p className="text-red-600 text-xs">Invalid User Address</p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="soilAmount">sOIL Amount</label>
              <ControlledNumberInput
                id="soilAmount"
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none"
                placeholder="Number of sOIL to be covered"
                amount={inputs.soilAmount}
                onAmountChange={(amount) =>
                  setInputs((prev) => ({ ...prev, soilAmount: amount }))
                }
              />
              {inputs.soilAmount <= soilBalance ? (
                <span className="text-xs text-gray-400">
                  Your SOIL Balance: {soilBalance}
                </span>
              ) : (
                <span className="text-xs text-red-600">
                  Exceed Your SOIL Balance!
                </span>
              )}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between mt-6">
        <Button
          type="submit"
          disabled={disabled}
          variant={"main"}
          className="w-full"
          onClick={liquidateWrapped}
        >
          Liquidate
          {loading && <Loader className="w-7 h-6 stroke-white fill-white" />}
        </Button>
      </CardFooter>
    </Card>
  );
}
