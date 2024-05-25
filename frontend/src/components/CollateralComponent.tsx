import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DepositToken, DepositTokens } from "@/constants/token";
import { useBalances } from "@/provider/balanceProvider";
import { usePrices } from "@/provider/priceProvider/usePrices";
import { Deposit } from "@/routes/borrow/BorrowModal";
import { NumberInput } from "./NumberInput";
import { TokenIconWithName } from "./TokenIconWithName";
import { cn } from "@/lib/utils";

type Props = {
  deposit: Deposit;
  isError?: boolean;
  errorMessage?: string;
  onTokenChange?: (token: DepositToken) => void;
  onAmountChange?: (amount: number) => void;
  className?: string;
};

export const CollateralComponent: React.FC<Props> = ({
  onTokenChange,
  onAmountChange,
  isError,
  deposit,
  errorMessage,
  className,
}) => {
  const { prices } = usePrices();
  const { getBalances } = useBalances();
  return (
    <div className={cn("w-full font-satoshi", className)}>
      <div className="flex items-end justify-between mb-2 font-satoshi">
        <h3>Collaterals</h3>
        <span className="text-xs text-gray-400">
          {`Balance:
          ${getBalances(deposit.token).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} 
          ${deposit.token}`}
        </span>
      </div>
      <label
        htmlFor="collateralInput"
        className="flex items-center justify-between h-[4.5rem] gap-2 bg-green-dim rounded-md px-2"
      >
        <Select
          defaultValue="WETH"
          onValueChange={(token: DepositToken) => {
            onTokenChange?.(token);
          }}
        >
          <SelectTrigger className="flex items-center justify-between rounded-full h-11 w-[7.5rem] pl-1.5 pr-3 font-satoshi">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {DepositTokens.map((token) => (
              <SelectItem value={token} key={token}>
                <TokenIconWithName token={token} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-col items-end justify-center pt-1 pr-3">
          <NumberInput
            id="collateralInput"
            onAmountChange={onAmountChange}
            className="w-full text-right text-lg"
            autoComplete="off"
          />

          <p className="text-xs text-gray-400 right-3 bottom-2">
            price: $
            {prices[deposit.token].toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </label>

      <div className="mt-2 h-4">
        {isError && (
          <span className="text-xs text-red-600">{errorMessage}</span>
        )}
      </div>
    </div>
  );
};
