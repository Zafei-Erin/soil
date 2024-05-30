import { ChainIcon } from "@/components";
import { ChainInfo, DestinationChain, DestinationChainIDs } from "@/constants";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";
import { DEFAULT_CHAIN_TO_UPDATE } from "./default";

type Props = {
  setChainToUpdate: (token: DestinationChain) => void;
  className?: string;
  mode?: "large" | "small";
};

export const ChainTab: React.FC<Props> = ({
  setChainToUpdate,
  className,
  mode,
}) => {
  return (
    <Tabs
      defaultValue={DEFAULT_CHAIN_TO_UPDATE}
      onValueChange={(chain) => setChainToUpdate(chain as DestinationChain)}
    >
      <TabsList className={cn("w-full bg-green-dim text-white", className)}>
        {DestinationChainIDs.map((chainId) => (
          <TabsTrigger
            key={ChainInfo[chainId].name}
            value={ChainInfo[chainId].name}
            className="text-sm px-2 w-full gap-1"
          >
            <div className={cn("hidden", mode !== "small" && "md:block")}>
              {ChainInfo[chainId].name}
            </div>
            <ChainIcon chain={ChainInfo[chainId].name} className="w-4 h-4" />
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
