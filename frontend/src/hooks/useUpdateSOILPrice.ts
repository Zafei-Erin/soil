import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, formatUnits } from "ethers";

import SoilSource from "@/abis/SoilSource.json";
import { ChainID, Selector, TokenAddress } from "@/constants";
import { isValidChain } from "@/lib/utils";

export function useUpdateSOILPrice() {
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
    const contract = new Contract(soilAddress, SoilSource.abi, signer);
    const result = await contract.getEstimatedFeeAmount(selector);
    const fee = parseFloat(formatUnits(result));
    return fee;
  };

  const updatePrice = async (selector: Selector, gas: bigint) => {
    if (!isConnected || !walletProvider) {
      throw Error("User disconnected");
    }

    if (!chainId || !isValidChain(chainId) || chainId !== ChainID.Optimism) {
      throw Error("Chain not support");
    }
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();

    const soilAddress = TokenAddress[chainId].SOIL;
    const contract = new Contract(soilAddress, SoilSource.abi, signer);
    await contract.updateCrudeOilPriceOnDestinationChain(selector, {
      value: gas,
    });
  };

  return { getEstimatedFee, updatePrice };
}
