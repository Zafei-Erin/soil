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
import { Position } from "@/constants/position";
import { useRepay } from "@/hooks/useRepay";
import { Loader } from "@/icons";
import { cn } from "@/lib/utils";
import { useBalances } from "@/provider/balanceProvider";
import { useHealthFactor } from "@/provider/healthFactorProvider";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { SoilComponent } from "./SoilComponent";

type Props = {
  className?: string;
  position: Position;
  refreshPosition: () => Promise<void>;
};

export const RepayModal: React.FC<Props> = ({
  className,
  position,
  refreshPosition,
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const { healthFactor } = useHealthFactor();
  const { getBalances } = useBalances();
  const { repay } = useRepay();

  const soilPrice =
    (position.deposited * 0.67) / (healthFactor * getBalances("SOIL"));
  const remainDebt = Math.max(getBalances("SOIL") - amount, 0);
  const estimatedRemainDebtValue = remainDebt * soilPrice;
  const estimatedHealthFactor =
    (position.deposited / estimatedRemainDebtValue) * 0.67;

  useEffect(() => {
    setAmount(0);
  }, [open]);

  const error = getBalances("SOIL") - amount < 0;
  const disabled = error || amount <= 0 || loading;

  const repayWrapped = async () => {
    setLoading(true);
    try {
      await repay(amount);
      refreshPosition();
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
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          title="Repay"
          onAmountChange={setAmount}
          isError={error}
          errorMessage="Exceeds your debt"
        />

        <div className="bg-green-dim w-full flex flex-col items-center px-4 rounded-lg">
          <div className="flex items-center justify-between w-full h-12">
            <span>Remaining debt</span>
            <span>
              {remainDebt.toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </span>
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
                {isNaN(estimatedHealthFactor)
                  ? "0.00"
                  : estimatedHealthFactor.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:space-x-0">
          <Button disabled={disabled} onClick={repayWrapped}>
            Repay
            {loading && <Loader className="w-7 h-6 stroke-white fill-white" />}
          </Button>

          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
