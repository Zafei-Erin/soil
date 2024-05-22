import { useBalances } from "@/provider/balanceProvider";
import { usePrices } from "@/provider/priceProvider";
import { useEffect, useRef, useState } from "react";

type Props = {
  amount?: number;
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>("");
  const { prices } = usePrices();
  const { getBalances } = useBalances();

  useEffect(() => {
    setValue(amount == 0 ? "" : amount == undefined ? "" : amount.toString());
  }, [amount]);

  return (
    <div>
      <div className="flex gap-2">
        <div className="bg-gray-100 flex items-center justify-center px-4 w-32 rounded-lg h-12 border border-gray-200">
          SOIL
        </div>
        <div className="bg-gray-100 h-12 w-30 rounded-lg border border-gray-200 px-4 py-1">
          <input
            className="bg-transparent appearance-none focus:outline-none block"
            ref={inputRef}
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => {
              if (e.target.value == "") {
                setValue("");
                onAmountChange?.(0);
                return;
              }
              const n = Number(e.target.value);
              if (!isNaN(n)) {
                setValue(e.target.value);
                onAmountChange?.(n);
              }
            }}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">
              price: $
              {prices["SOIL"].toLocaleString(undefined, {
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
