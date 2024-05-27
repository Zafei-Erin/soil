import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { CollateralComponent } from "@/components/CollateralComponent";
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
import { DepositToken } from "@/constants/token";
import { useCollaterals } from "@/hooks/useCollaterals";
import { useWithDraw } from "@/hooks/useWithdraw";
import { Loader } from "@/icons";
import { useHealthFactor } from "@/provider/healthFactorProvider";
import { usePrices } from "@/provider/priceProvider";

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

  const { healthFactor } = useHealthFactor();
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
        <Button className={className}>Withdraw</Button>
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

        <div className="w-full flex flex-col items-center rounded-lg font-satoshi">
          <div className="flex items-center justify-between w-full h-10">
            <span>Remaining supply</span>
            <span>
              {remainingSupply.toLocaleString(undefined, {
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
            onClick={withDrawWrapped}
            className="rounded-full w-full bg-green-bright/90 hover:bg-green-bright/80 transition-all px-6"
          >
            <span>WithDraw</span>
            {loading && <Loader className="w-7 h-6 stroke-white fill-white" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
