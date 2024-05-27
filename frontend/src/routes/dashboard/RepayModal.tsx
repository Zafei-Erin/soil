import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useShowToast } from "@/components/useShowToast";
import { Position } from "@/constants/position";
import { useRepay } from "@/hooks/useRepay";
import { Loader } from "@/icons";
import { useBalances } from "@/provider/balanceProvider";
import { useHealthFactor } from "@/provider/healthFactorProvider";
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
  const { showSuccessToast, showFailToast } = useShowToast();

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
      showSuccessToast(`You have Repay ${amount} SOIL!`);
    } catch (error) {
      showFailToast("Failed to repay SOIL");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={className} variant={"secondary"}>
          Repay
        </Button>
      </DialogTrigger>

      <DialogContent className="border-0 bg-black-dim sm:w-96">
        <DialogHeader>
          <DialogTitle>Repay SOIL</DialogTitle>
        </DialogHeader>

        <SoilComponent
          title="Repay"
          onAmountChange={setAmount}
          isError={error}
          errorMessage="Exceeds your debt"
        />
        <hr className="h-0.5 mt-2 bg-gradient-to-r from-gray-400" />

        <div className="w-full flex flex-col items-center rounded-lg font-satoshi">
          <div className="flex items-center justify-between w-full h-10">
            <span>Remaining debt</span>
            <span>
              {remainDebt.toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
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

        <DialogFooter className="mx-auto w-full">
          <Button
            disabled={disabled}
            onClick={repayWrapped}
            variant={"main"}
            className="w-full"
          >
            <span>Repay</span>
            {loading && <Loader className="w-7 h-6 stroke-white fill-white" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
