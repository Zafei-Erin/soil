import { useState } from "react";

import { DestinationChain } from "@/constants";
import { usePrices } from "@/provider";
import { ChainTab } from "./ChainTab";
import { UpdateSoilPriceModal } from "./UpdateSoilPriceModal";
import { DEFAULT_CHAIN_TO_UPDATE } from "./default";

export const UpdateSoilPriceComponent: React.FC = () => {
  const { prices } = usePrices();

  const [chainToUpdate, setChainToUpdate] = useState<DestinationChain>(
    DEFAULT_CHAIN_TO_UPDATE
  );

  return (
    <div className="flex h-fit w-full rounded-lg bg-black-dim px-3 py-6 font-satoshi max-md:flex-col max-md:gap-6 sm:p-8 md:gap-4">
      <div className="flex min-w-48 items-center justify-between md:flex-col md:justify-center md:gap-3">
        <h1 className="font-semibold sm:text-xl">Update SOIL Price</h1>
        <ChainTab setChainToUpdate={setChainToUpdate} />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 pr-3">
        {/* price on chain */}
        <div className="flex w-full items-center justify-between gap-2">
          <h3 className="text-gray-400">Price on {chainToUpdate}:</h3>
          <div className="text-right">
            {`$ ${prices.SOIL[chainToUpdate].toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}`}
          </div>
        </div>

        {/* realtime price */}
        <div className="flex w-full items-center justify-between gap-2">
          <h3 className="text-gray-400">Realtime Price:</h3>
          <div className="text-right">
            {`$ ${prices.SOIL.Optimism.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}`}
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <UpdateSoilPriceModal />
      </div>
    </div>
  );
};
