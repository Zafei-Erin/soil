import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Selector } from "@/constants/Selector";
import { ChainInfo, DestinationChainID } from "@/constants/chainId";
import { useUpdateSOILPrice } from "@/hooks/useUpdateSOILPrice";
import { Loader } from "@/icons";
import { isValidChain } from "@/lib/utils";
import { usePrices } from "@/provider/priceProvider";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

type Props = {
  chainId: DestinationChainID;
};

const GasToken = {
  NativeToken: {
    name: "NativeToken",
    value: 0,
  },
  Link: {
    name: "Link",
    value: 1,
  },
} as const;
type GasToken = keyof typeof GasToken;

const DEFAULT_GAS_TOKEN: GasToken = "NativeToken";

export const UpdateSoilPriceModal: React.FC<Props> = ({ chainId }) => {
  const { prices } = usePrices();
  const { updateSOILPrice } = useUpdateSOILPrice();
  const [loading, setLoading] = useState<boolean>(false);
  const [gasToken, setGasToken] = useState<GasToken>(DEFAULT_GAS_TOKEN);
  const disabled = !(chainId && isValidChain(chainId)) || loading;

  const updatePrice = async () => {
    setLoading(true);
    try {
      await updateSOILPrice(Selector[chainId], GasToken[gasToken].value);
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
    <div className="max-w-3xl w-full h-fit flex flex-col gap-6 max-md:items-center justify-between mx-4 p-8 rounded-lg border border-gray-200">
      {/* price on chain */}
      <div className="w-full flex items-center justify-between">
        <h3 className="font-semibold">
          Current Price of Soil on {ChainInfo[chainId].name}:
        </h3>
        <div className="font-semibold border-b border-black px-4 py-2 min-w-28 flex items-center justify-center">
          {prices.SOIL_ON_CHAIN.toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
        </div>
      </div>

      {/* realtime price */}
      <div className="w-full flex items-center justify-between">
        <h3 className="font-semibold">Realtime Price of Soil:</h3>
        <div className="font-semibold border-b border-black px-4 py-2 min-w-28 flex items-center justify-center">
          {prices.SOIL.toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
        </div>
      </div>

      {/* chain to pay gas */}
      <div className="w-full flex items-center justify-between">
        <h3 className="font-semibold">Pay Gas in:</h3>
        <Tabs
          defaultValue={GasToken.NativeToken.name}
          onValueChange={(token) => setGasToken(token as GasToken)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value={GasToken.NativeToken.name}>
              {ChainInfo[chainId].token}
            </TabsTrigger>
            <TabsTrigger value={GasToken.Link.name}>LINK</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Button
        disabled={disabled}
        onClick={updatePrice}
        className="w-full flex items-center justify-center gap-2 disabled:cursor-not-allowed"
      >
        Update SOIL Price
        {loading && <Loader className="w-7 h-6 stroke-white fill-white" />}
      </Button>
    </div>
  );
};
