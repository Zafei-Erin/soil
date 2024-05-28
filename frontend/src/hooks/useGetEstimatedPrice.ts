import SOIL from "@/abis/SOIL.json";
import { Selector } from "@/constants/Selector";
import { ChainID } from "@/constants/chainId";
import { TokenAddress } from "@/constants/token";
import { isValidChain } from "@/lib/utils";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract } from "ethers";

export function useUpdatePrice() {
  const { isConnected, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const getEstimatedFee = async (selector: Selector) => {
    if (!isConnected || !walletProvider) {
      throw Error("User disconnected");
    }

    if (!chainId || !isValidChain(chainId) || chainId !== ChainID.Optimism) {
      throw Error("Chain not support");
    }
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();

    const soilAddress = TokenAddress[chainId].SOIL;
    const contract = new Contract(soilAddress, SOIL.abi, signer);
    const result = await contract.getEstimatedFeeAmount(selector);
    console.log(result);
    // const fee = parseFloat(formatUnits(result, 18));
    return 0;
  };

  return { getEstimatedFee };
}
