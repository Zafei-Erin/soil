import { NumberInput, TokenIconWithName } from "@/components";
import { DepositToken, DepositTokens } from "@/constants";
import { cn } from "@/lib/utils";
import { useBalances, usePrices } from "@/provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";

export type Collateral = {
  token: DepositToken;
  amount: number;
};

type Props = {
  deposit: Collateral;
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
      <div className="mb-2 flex items-end justify-between font-satoshi">
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
        className="flex h-[4.5rem] items-center justify-between gap-2 rounded-md bg-green-dim px-2"
      >
        <Select
          defaultValue="WETH"
          onValueChange={(token: DepositToken) => {
            onTokenChange?.(token);
          }}
        >
          <SelectTrigger className="h-11 w-[8.5rem] rounded-full pl-1.5 pr-3 font-satoshi">
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

        <div className="flex flex-col items-end justify-center pr-3 pt-1">
          <NumberInput
            id="collateralInput"
            onAmountChange={onAmountChange}
            className="w-full text-right text-lg"
            autoComplete="off"
          />

          <p className="bottom-2 right-3 text-xs text-gray-400">
            price: $
            {(prices[deposit.token] || 0).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </label>

      <div className="h-4 sm:mt-2">
        {isError && (
          <span className="text-xs text-red-600">{errorMessage}</span>
        )}
      </div>
    </div>
  );
};
