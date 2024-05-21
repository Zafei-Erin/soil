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
import { useRepay } from "@/hooks/useRepay";
import { Loader } from "@/icons";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { SoilComponent } from "./SoilComponent";

type Props = {
  className?: string;
};

export const RepayModal: React.FC<Props> = ({ className }) => {
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const { healthFactor } = useHealthFactor();
  const { position } = usePosition();
  const { balances } = useBalances();
  const { repay } = useRepay();

  const soilPrice =
    (position.deposited * 0.67) / (healthFactor * balances["SOIL"]);
  const remainDebt = Math.max(balances["SOIL"] - amount, 0);
  const estimatedRemainDebtValue = remainDebt * soilPrice;
  const estimatedHealthFactor =
    (position.deposited / estimatedRemainDebtValue) * 0.67;

  useEffect(() => {
    setAmount(0);
  }, [open]);

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
          onAmountChange={setAmount}
          isError={error}
          errorMessage="Exceeds your debt"
        />

        <div className="bg-gray-100 w-full flex flex-col items-center px-4 rounded-lg border border-gray-200">
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
                {estimatedHealthFactor.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col max-sm:space-y-2">
          <Button variant="default" disabled={disabled} onClick={repayFormat}>
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
