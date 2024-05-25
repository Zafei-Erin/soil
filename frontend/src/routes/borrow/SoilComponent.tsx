import { TokenIconWithName } from "@/components/TokenIconWithName";
import { Token } from "@/constants/token";
import { cn } from "@/lib/utils";
import { useBalances } from "@/provider/balanceProvider";
import { usePrices } from "@/provider/priceProvider";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useEffect, useRef, useState } from "react";

type Props = {
  amount?: number;
  isError?: boolean;
  errorMessage?: string;
  onAmountChange?: (amount: number) => void;
  className?: string;
};

export const SoilComponent: React.FC<Props> = ({
  amount,
  onAmountChange,
  isError,
  errorMessage,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>("");
  const { isConnected } = useWeb3ModalAccount();
  const { prices } = usePrices();
  const { getBalances } = useBalances();

  useEffect(() => {
    setValue(amount == 0 ? "" : amount == undefined ? "" : amount.toString());
  }, [amount]);

  return (
    <div className={cn("w-full font-satoshi", className)}>
      <div className="flex items-end justify-between mb-2 font-satoshi">
        <h3>Borrow</h3>
        <span className="text-xs text-gray-400">
          {`Balance:
          ${getBalances(Token.SOIL).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} 
          ${Token.SOIL}`}
        </span>
      </div>
      <label
        htmlFor="borrowInput"
        className="flex items-center justify-between h-[4.5rem] gap-2 bg-green-dim rounded-md px-2"
      >
        <div className="flex bg-black items-center justify-between rounded-full h-11 pl-1.5 pr-3 font-satoshi font-normal">
          <TokenIconWithName token={Token.SOIL} />
        </div>

        <div className="flex flex-col items-end justify-center pt-1 pr-3">
          <input
            className="bg-transparent appearance-none focus:outline-none block w-full text-right text-lg"
            ref={inputRef}
            type="text"
            id="borrowInput"
            inputMode="decimal"
            value={value}
            autoComplete="off"
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

          <span className="text-xs text-gray-400 right-3 bottom-2">
            price: $
            {!isConnected
              ? prices.SOIL.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })
              : prices.SOIL_ON_CHAIN.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
          </span>
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
