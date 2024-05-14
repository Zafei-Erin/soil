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
import { useHealthFactor } from "@/hooks/useHealthFactor";
import { usePosition } from "@/hooks/usePosition";
import { usePrices } from "@/hooks/usePrices";
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
  const estimatedHealthFactor =
    (position.deposited - prices[withdraw.token] * withdraw.amount) /
    position.borrowed;

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let t = parseFloat(e.target.value);
    t = isNaN(t) ? 0 : t;
    setDeposit((prev) => ({ ...prev, amount: t }));
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
          status="withdraw"
          onTokenChange={(token: DepositToken) => {
            setDeposit((prev) => ({
              ...prev,
              token: token,
            }));
          }}
          onAmountChange={onAmountChange}
          deposit={withdraw}
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

        <DialogFooter className="sm:justify-start">
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
