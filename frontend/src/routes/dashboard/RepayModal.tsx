import { SoilComponent } from "./SoilComponent";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useBalances } from "@/hooks/useBalances";
import { useHealthFactor } from "@/hooks/useHealthFactor";
import { usePosition } from "@/hooks/usePosition";
import { usePrices } from "@/hooks/usePrices";
import { useRepay } from "@/hooks/useRepay";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

type Props = {
  className?: string;
};

export const RepayModal: React.FC<Props> = ({ className }) => {
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const { healthFactor } = useHealthFactor();
  const { prices } = usePrices();
  const { position } = usePosition();
  const { balances } = useBalances();
  const { repay } = useRepay();

  const remainDebt = Math.max(balances["SOIL"] - amount, 0);
  const estimatedRemainDebtValue = remainDebt * prices["SOIL"];
  const estimatedHealthFactor =
    (position.deposited / estimatedRemainDebtValue) * 0.67;

  const error = balances["SOIL"] - amount < 0;
  const disabled = error || amount <= 0 || loading;

  const repayFormat = async () => {
    if (amount <= 0) {
      return;
    }
    setLoading(true);
    try {
      await repay(amount);
      toast({
        duration: 1500,
        title: "Repay Successfully",
        description: `You have Repay ${amount} SOIL!`,
      });
    } catch (error) {
      toast({
        duration: 1500,
        title: "Repay Failed",
        description: `${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"} className={cn("w-32", className)}>
          Repay
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Repay SOIL</DialogTitle>
        </DialogHeader>

        <SoilComponent
          onAmountChange={setAmount}
          isError={error}
          errorMessage="Exceeds your debt"
        />

        <div className="bg-gray-100 w-full flex flex-col items-center px-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between w-full h-12">
            <span>Remaining debt</span>
            <span>{remainDebt}</span>
          </div>
          <hr className="h-0.5 w-full bg-gray-200 " />
          <div className="flex items-center justify-between w-full h-12">
            <span>Health factor</span>
            <div className="flex items-center justify-normal gap-1">
              <div>
                {healthFactor.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </div>
              <ArrowRight className="w-4 h-4" />
              <div>
                {estimatedHealthFactor.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button disabled={disabled} onClick={repayFormat}>
            Repay
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
