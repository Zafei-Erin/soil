import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBalances } from "@/hooks/useBalances";
import { usePrices } from "@/hooks/usePrices";
import { Deposit } from "@/routes/borrow/BorrowModal";
import { DepositToken } from "@/types/address";

type Props = {
  status: "deposit" | "withdraw";
  deposit: Deposit;
  errorMessage?: string;
  onTokenChange?: (token: DepositToken) => void;
  onAmountChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const DepositComponent: React.FC<Props> = ({
  onTokenChange,
  onAmountChange,
  deposit,
  errorMessage,
}) => {
  const { prices } = usePrices();
  const { balances } = useBalances();
  return (
    <div>
      <div className="flex gap-2">
        <Select
          defaultValue="WETH"
          onValueChange={(token: DepositToken) => {
            onTokenChange?.(token);
          }}
        >
          <SelectTrigger className="bg-gray-100 flex items-center justify-between px-4 w-32 rounded-lg h-12 border border-gray-200">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {DepositToken.map((token) => (
              <SelectItem value={token} key={token}>
                <div className="flex items-center px-4 w-30 h-10">{token}</div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="bg-gray-100 h-12 w-full rounded-lg border border-gray-200 px-4 py-1">
          <input
            type="number"
            inputMode="decimal"
            onChange={onAmountChange}
            className="bg-transparent appearance-none focus:outline-none"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">
              price: $
              {prices[deposit.token].toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-600">
              balance: {balances[deposit.token]}
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <p className="text-xs text-red-600 mt-2 block">{errorMessage}</p>
      )}
    </div>
  );
};
