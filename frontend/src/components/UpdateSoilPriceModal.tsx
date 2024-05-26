import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DestinationChain } from "@/constants/chain";
import { ChainInfo, DestinationChainIDs } from "@/constants/chainId";
import { Loader } from "@/icons";
import { usePrices } from "@/provider/priceProvider";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useState } from "react";
import { ChainIcon } from "./ChainIcon";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

const DEFAULT_CHAIN_TO_UPDATE: DestinationChain = DestinationChain.POLYGON;

export const UpdateSoilPriceModal: React.FC = () => {
  const { isConnected } = useWeb3ModalAccount();
  const { prices } = usePrices();
  const [loading, setLoading] = useState<boolean>(false);

  const [chainToUpdate, setChainToUpdate] = useState<DestinationChain>(
    DEFAULT_CHAIN_TO_UPDATE
  );
  const disabled = !isConnected || loading;

  const updatePrice = async () => {
    setLoading(true);
    try {
      toast({
        duration: 1500,
        title: "Update SOIL Price Successfully",
        description: `You have updated the price successfully!`,
      });
    } catch (error) {
      console.log(error);
      toast({
        duration: 1500,
        title: "Failed to Update SOIL Price",
        description: `${error}`,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-black-dim w-full h-fit md:gap-4 flex max-md:flex-col p-8 rounded-lg font-satoshi max-md:gap-6">
      <div className="flex md:flex-col items-center justify-between md:justify-center min-w-48">
        <h1 className="sm:text-xl font-semibold mb-3">Update SOIL Price</h1>
        <Tabs
          defaultValue={DEFAULT_CHAIN_TO_UPDATE}
          onValueChange={(token) => setChainToUpdate(token as DestinationChain)}
        >
          <TabsList className="w-full bg-green-dim text-white">
            {DestinationChainIDs.map((chainId) => (
              <TabsTrigger value={ChainInfo[chainId].name} className="text-sm">
                <div className="hidden md:block">{ChainInfo[chainId].name}</div>
                <ChainIcon
                  chain={ChainInfo[chainId].name}
                  className="md:hidden"
                />
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 flex-1 pr-6">
        {/* price on chain */}
        <div className="w-full flex items-center justify-between">
          <h3 className="text-gray-400">Price of Soil on {chainToUpdate}:</h3>
          <div className="text-right">
            {`$ ${prices.SOIL_ON_CHAIN.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}`}
          </div>
        </div>

        {/* realtime price */}
        <div className="w-full flex items-center justify-between">
          <h3 className="text-gray-400">Realtime Price of Soil:</h3>
          <div className="text-right">
            {`$ ${prices.SOIL.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}`}
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <Button
          disabled={disabled}
          onClick={updatePrice}
          className="w-full md:w-fit rounded-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-bright to-green-bright/60 text-black transition-all hover:bg-green-bright/90 disabled:cursor-not-allowed"
        >
          Update SOIL Price
          {loading && <Loader className="w-7 h-6 stroke-white fill-white" />}
        </Button>
      </div>
    </div>
  );
};
