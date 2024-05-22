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
import { useWithDraw } from "@/hooks/useWithdraw";
import { Loader } from "@/icons";
import { cn } from "@/lib/utils";
import { usePrices } from "@/provider/priceProvider";
import { DepositToken } from "@/types/address";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

type Deposit = {
  token: DepositToken;
  amount: number;
};

type Props = {
  className?: string;
};

export const WithdrawModal: React.FC<Props> = ({ className }) => {
  const [withdraw, setWithdraw] = useState<Deposit>({
    token: "WETH",
    amount: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const { healthFactor } = useHealthFactor();
  const { prices } = usePrices();
  const { position } = usePosition();
  const { withDraw } = useWithDraw();

  const estimatedRemainDeposit =
    position.deposited - prices[withdraw.token] * withdraw.amount;
  const estimatedHealthFactor =
    (Math.max(estimatedRemainDeposit, 0) / position.borrowed) * 0.67;

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

  const onAmountChange = (amount: number) => {
    setWithdraw((prev) => ({ ...prev, amount: amount }));
  };

  const withDrawWrapped = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
      setWithdraw((prev) => ({ ...prev, amount: 0 }));
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"} className={cn("w-32", className)}>
          Withdraw
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw {withdraw.token}</DialogTitle>
        </DialogHeader>

        <DepositComponent
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

        <DialogFooter className="sm:justify-end mt-3">
          <Button
            disabled={disabled}
            onClick={withDrawWrapped}
            className="flex items-center justify-center gap-2"
          >
            <span>WithDraw</span>
            {loading && <Loader className="w-7 h-6 stroke-white fill-white" />}
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
