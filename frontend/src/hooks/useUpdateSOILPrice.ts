import SOIL from "@/abis/SOIL.json";
import { Selector } from "@/constants/Selector";
import { TokenAddress } from "@/constants/token";
import { isValidChain } from "@/lib/utils";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract } from "ethers";

export function useUpdateSOILPrice() {
  const { isConnected, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const updateSOILPrice = async (
    destinationChainSelector: Selector,
    PayFeesIn: 0 | 1
  ) => {
    if (!isConnected || !walletProvider) {
      throw Error("User disconnected");
    }

    if (!chainId || !isValidChain(chainId)) {
      throw Error("Chain not support");
    }
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();

    const soilAddress = TokenAddress[chainId].SOIL;
    const contract = new Contract(soilAddress, SOIL.abi, signer);

    console.log(destinationChainSelector, PayFeesIn, contract);
    // const result = await contract.updateCrudeOilPriceOnDestinationChain(
    //   destinationChainSelector,
    //   PayFeesIn
    // );
    // console.log("redeem result", result);
  };

  return { updateSOILPrice };
}
