import { ChainIconWithName } from "@/components/ChainIconWithName";
import { Chain, ChainID, ChainInfo, Chains } from "@/constants";
import { isValidChain } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { useSwitchNetwork, useWeb3ModalAccount } from "@web3modal/ethers/react";

export const ChainSelector: React.FC = () => {
  const { chainId } = useWeb3ModalAccount();
  const { switchNetwork } = useSwitchNetwork();
  const defaultChain =
    (chainId && isValidChain(chainId) && ChainInfo[chainId].name) ||
    Chain.OPTIMISM;

  return (
    <Select
      value={defaultChain}
      onValueChange={(chain: Chain) => {
        switchNetwork(ChainID[chain]);
      }}
    >
      <SelectTrigger className="h-8 w-fit rounded-sm border border-green-light p-1 font-satoshi text-xs text-green-light sm:text-sm">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {Chains.map((chain) => (
          <SelectItem
            value={chain}
            key={chain}
            className="h-10 font-satoshi text-xs"
          >
            <ChainIconWithName chain={chain} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
