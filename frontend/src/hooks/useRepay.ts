import SOIL from "@/abis/SOIL.json";
import { TokenAddress } from "@/constants/token";
import { isValidChain } from "@/lib/utils";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, parseUnits } from "ethers";

export function useRepay() {
  const { isConnected, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const repay = async (amount: number) => {
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
    await contract.burn(parseUnits(amount.toString()));
  };

  return { repay };
}
