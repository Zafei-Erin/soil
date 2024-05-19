import { DepositComponent } from "@/components/DepositComponent";
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
import { useHealthFactor } from "@/hooks/useHealthFactor";
import { usePosition } from "@/hooks/usePosition";
import { usePrices } from "@/hooks/usePrices";
import { useWithDraw } from "@/hooks/useWithdraw";
import { DepositToken } from "@/types/address";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

type Deposit = {
  token: DepositToken;
  amount: number;
};

export const WithdrawModal: React.FC = () => {
  const [withdraw, setDeposit] = useState<Deposit>({
    token: "WETH",
    amount: 0,
  });

  const { healthFactor } = useHealthFactor();
  const { prices } = usePrices();
  const { position } = usePosition();
  const { withDraw } = useWithDraw();

  const estimatedRemainDeposit =
    position.deposited - prices[withdraw.token] * withdraw.amount;
  const estimatedHealthFactor =
    (Math.max(estimatedRemainDeposit, 0) / position.borrowed) * 0.67;

  const disabled = estimatedHealthFactor < 1 || estimatedRemainDeposit < 0;

  let errorMessage = "";
  if (estimatedHealthFactor < 1) {
    errorMessage = "Remaining collateral cannot support the loan";
  }
  if (estimatedRemainDeposit < 0) {
    errorMessage = "Exceeds your balance";
  }

  const onAmountChange = (amount: number) => {
    setDeposit((prev) => ({ ...prev, amount: amount }));
  };

  const withDrawFormat = async () => {
    try {
      await withDraw(withdraw.token, withdraw.amount);
      toast({
        duration: 1500,
        title: "Withdraw Successfully",
        description: `You have Withdraw ${withdraw.amount} ${withdraw.token}!`,
      });
    } catch (error) {
      toast({
        duration: 1500,
        title: "Withdraw Failed",
        description: `${error}`,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"} className="w-32">
          Withdraw
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw {withdraw.token}</DialogTitle>
        </DialogHeader>

        <DepositComponent
          onTokenChange={(token: DepositToken) => {
            setDeposit((prev) => ({
              ...prev,
              token: token,
            }));
          }}
          onAmountChange={onAmountChange}
          deposit={withdraw}
          isError={disabled}
          errorMessage={errorMessage}
        />

        <div className="bg-gray-100 w-full flex flex-col items-center px-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between w-full h-12">
            <span>Remaining supply</span>
            <span>x</span>
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
          <Button disabled={disabled} onClick={withDrawFormat}>
            WithDraw
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
