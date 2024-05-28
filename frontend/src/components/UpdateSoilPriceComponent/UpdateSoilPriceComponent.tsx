import { DestinationChain } from "@/constants/chain";
import { usePrices } from "@/provider/priceProvider";
import { useState } from "react";
import { ChainTab } from "./ChainTab";
import { UpdateSoilPriceModal } from "./UpdateSoilPriceModal";

const DEFAULT_CHAIN_TO_UPDATE: DestinationChain = DestinationChain.POLYGON;

export const UpdateSoilPriceComponent: React.FC = () => {
  const { prices } = usePrices();

  const [chainToUpdate, setChainToUpdate] = useState<DestinationChain>(
    DEFAULT_CHAIN_TO_UPDATE
  );

  return (
    <div className="bg-black-dim w-full h-fit md:gap-4 flex max-md:flex-col px-3 py-6 sm:p-8 rounded-lg font-satoshi max-md:gap-6">
      <div className="flex md:flex-col md:gap-3 items-center justify-between md:justify-center min-w-48">
        <h1 className="sm:text-xl font-semibold">Update SOIL Price</h1>
        <ChainTab setChainToUpdate={setChainToUpdate} />
      </div>

      <div className="flex flex-col items-center justify-center gap-4 flex-1 pr-3">
        {/* price on chain */}
        <div className="w-full flex items-center justify-between gap-2">
          <h3 className="text-gray-400">Price on {chainToUpdate}:</h3>
          <div className="text-right">
            {`$ ${prices.SOIL_ON_CHAIN.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}`}
          </div>
        </div>

        {/* realtime price */}
        <div className="w-full flex items-center justify-between gap-2">
          <h3 className="text-gray-400">Realtime Price:</h3>
          <div className="text-right">
            {`$ ${prices.SOIL.toLocaleString(undefined, {
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
