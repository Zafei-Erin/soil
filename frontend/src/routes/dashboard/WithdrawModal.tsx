import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { CollateralComponent } from "@/components";
import { DepositToken, Position } from "@/constants";
import { useCollaterals } from "@/hooks/useCollaterals";
import { useShowToast } from "@/hooks/useShowToast";
import { useWithDraw } from "@/hooks/useWithdraw";
import { Loader } from "@/icons";
import { useHealthFactor, usePrices } from "@/provider";
import { Button } from "@/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";

type Withdraw = {
  token: DepositToken;
  amount: number;
};

type Props = {
  className?: string;
  position: Position;
  refreshPosition: () => Promise<void>;
};

const DEFAULT_WITHDRAW: Withdraw = {
  token: "WETH",
  amount: 0,
};

export const WithdrawModal: React.FC<Props> = ({
  className,
  position,
  refreshPosition,
}) => {
  const [withdraw, setWithdraw] = useState<Withdraw>(DEFAULT_WITHDRAW);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const { healthFactor, refreshHealthFactor } = useHealthFactor();
  const { prices } = usePrices();
  const { withDraw } = useWithDraw();
  const { collaterals } = useCollaterals();
  const { showSuccessToast, showFailToast } = useShowToast();

  const estimatedRemainDeposit =
    position.deposited - prices[withdraw.token] * withdraw.amount;
  const estimatedHealthFactor =
    (Math.max(estimatedRemainDeposit, 0) / position.borrowed) * 0.67;
  const remainingSupply = Math.max(
    collaterals[withdraw.token] - withdraw.amount,
    0
  );

  const disabled =
    estimatedHealthFactor < 1 ||
    estimatedRemainDeposit < 0 ||
    withdraw.amount <= 0 ||
    loading;

  let errorMessage = "";
  if (estimatedHealthFactor < 1) {
    errorMessage = "Remaining collateral cannot support the loan";
  }
  if (estimatedRemainDeposit < 0) {
    errorMessage = "Exceeds your supply";
  }

  useEffect(() => {
    setWithdraw(DEFAULT_WITHDRAW);
  }, [open]);

  const onAmountChange = (amount: number) => {
    setWithdraw((prev) => ({ ...prev, amount: amount }));
  };

  const withDrawWrapped = async () => {
    setLoading(true);
    try {
      await withDraw(withdraw.token, withdraw.amount);
      refreshPosition();
      refreshHealthFactor();
      showSuccessToast(
        `You have Withdraw ${withdraw.amount} ${withdraw.token}!`
      );
    } catch (error) {
      showFailToast(`Failed to widthdraw ${withdraw.token}`);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={className} variant={"secondary"}>
          Withdraw
        </Button>
      </DialogTrigger>

      <DialogContent className="border-0 bg-black-dim sm:w-96">
        <DialogHeader>
          <DialogTitle>Withdraw {withdraw.token}</DialogTitle>
        </DialogHeader>

        <CollateralComponent
          onTokenChange={(token: DepositToken) => {
            setWithdraw((prev) => ({
              ...prev,
              token: token,
            }));
          }}
          onAmountChange={onAmountChange}
          deposit={withdraw}
          isError={disabled}
          errorMessage={errorMessage}
        />

        <hr className="h-0.5 bg-gradient-to-r from-gray-400" />

        <div className="flex w-full flex-col items-center rounded-lg font-satoshi">
          <div className="flex h-10 w-full items-center justify-between">
            <span>Remaining supply</span>
            <span>
              {remainingSupply.toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex h-12 w-full items-center justify-between">
            <span>Health factor</span>
            <div className="flex items-center justify-normal gap-1">
              <div>
                {healthFactor.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </div>
              <ArrowRight className="h-4 w-4" />
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
            onClick={withDrawWrapped}
            variant={"main"}
            className="w-full"
          >
            <span>WithDraw</span>
            {loading && <Loader className="h-6 w-7 fill-white stroke-white" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
