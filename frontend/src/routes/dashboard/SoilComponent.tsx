import { useBalances } from "@/provider/balanceProvider";
import { NumberInput } from "../../components/NumberInput";
import { usePrices } from "@/provider/priceProvider";

type Props = {
  isError?: boolean;
  errorMessage?: string;
  onAmountChange?: (amount: number) => void;
};

export const SoilComponent: React.FC<Props> = ({
  onAmountChange,
  isError,
  errorMessage,
}) => {
  const { prices } = usePrices();
  const { getBalances } = useBalances();

  return (
    <div>
      <div className="flex gap-2">
        <div className="bg-gray-100 flex items-center justify-center px-4 w-48 rounded-lg h-12 border border-gray-200">
          SOIL
        </div>
        <div className="bg-gray-100 h-12 w-full rounded-lg border border-gray-200 px-4 py-1">
          <NumberInput onAmountChange={onAmountChange} className="w-full" />
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">
              price: $
              {prices.SOIL_ON_CHAIN.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-600">
              balance: {getBalances("SOIL")}
            </p>
          </div>
        </div>
      </div>
      {isError && (
        <p className="text-xs text-red-600 mt-2 block">{errorMessage}</p>
      )}
    </div>
  );
};
