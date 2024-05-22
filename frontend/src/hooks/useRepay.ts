import SOIL from "@/abis/SOIL.json";
import { tokenAddress } from "@/constants/token";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, parseUnits } from "ethers";

export function useRepay() {
  const { isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const repay = async (amount: number) => {
    if (!isConnected || !walletProvider) {
      return;
    }
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const contract = new Contract(tokenAddress["SOIL"], SOIL.abi, signer);
    const result = await contract.burn(parseUnits(amount.toString()));
    console.log("redeem result", result);
  };

  return { repay };
}
