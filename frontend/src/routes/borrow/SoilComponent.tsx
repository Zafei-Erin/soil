import { useWeb3ModalAccount } from "@web3modal/ethers/react";

import { ControlledNumberInput, TokenIconWithName } from "@/components";
import { Chain, ChainInfo, Token } from "@/constants";
import { cn, isValidChain } from "@/lib/utils";
import { useBalances, usePrices } from "@/provider";

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
  const { isConnected, chainId } = useWeb3ModalAccount();
  const { prices } = usePrices();
  const { getBalances } = useBalances();
  const currentChain =
    (chainId && isValidChain(chainId) && ChainInfo[chainId].name) ||
    Chain.OPTIMISM;
  return (
    <div className={cn("w-full font-satoshi", className)}>
      <div className="mb-2 flex items-end justify-between font-satoshi">
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
        className="flex h-[4.5rem] items-center justify-between gap-2 rounded-md bg-green-dim px-2"
      >
        <div className="flex h-11 items-center justify-between rounded-full bg-black pl-1.5 pr-3 font-satoshi font-normal">
          <TokenIconWithName token={Token.SOIL} />
        </div>

        <div className="flex flex-col items-end justify-center pr-3 pt-1">
          <ControlledNumberInput
            id="borrowInput"
            className="text-right"
            amount={amount}
            onAmountChange={onAmountChange}
          />

          <span className="bottom-2 right-3 text-xs text-gray-400">
            price: $
            {!isConnected
              ? prices.SOIL[Chain.OPTIMISM].toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })
              : prices.SOIL[currentChain].toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
          </span>
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
