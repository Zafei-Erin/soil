import { useBalances } from "@/hooks/useBalances";
import { usePrices } from "@/hooks/usePrices";

type Props = {
  amount: number;
  isError?: boolean;
  errorMessage?: string;
  onAmountChange?: (amount: number) => void;
};

export const SoilComponent: React.FC<Props> = ({
  amount,
  onAmountChange,
  isError,
  errorMessage,
}) => {
  const { prices } = usePrices();
  const { balances } = useBalances();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let num = Number(e.target.value);
    num = isNaN(num) ? 0 : num;
    num = Math.max(num, 0);
    onAmountChange?.(num);
  };
  return (
    <div>
      <div className="flex gap-2">
        <div className="bg-gray-100 flex items-center justify-center px-4 w-32 rounded-lg h-12 border border-gray-200">
          SOIL1
        </div>
        <div className="bg-gray-100 h-12 w-30 rounded-lg border border-gray-200 px-4 py-1">
          <input
            value={amount == 0 ? "" : amount}
            inputMode="decimal"
            type="number"
            onBeforeInput={(e: React.CompositionEvent<HTMLInputElement>) => {
              if (e.data.includes("-") || e.data.includes("e")) {
                e.preventDefault();
              }
            }}
            onChange={onChange}
            className="bg-transparent appearance-none focus:outline-none"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">
              price: $
              {prices["SOIL"].toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-600">balance: {balances["SOIL"]}</p>
          </div>
        </div>
      </div>
      {isError && (
        <p className="text-xs text-red-600 mt-2 block">{errorMessage}</p>
      )}
    </div>
  );
};
