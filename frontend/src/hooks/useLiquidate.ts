import SOIL from "@/abis/SOIL.json";
import { LiquidateInfo } from "@/routes/liquidate/LiquidateCard";
import { tokenAddress } from "@/types/address";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, parseUnits } from "ethers";

export function useLiquidate() {
  const { isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const liquidate = async ({
    userAddress,
    collateral,
    soilAmount,
  }: LiquidateInfo) => {
    if (!isConnected || !walletProvider) {
      return;
    }
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const contract = new Contract(tokenAddress["SOIL"], SOIL.abi, signer);
    const result = await contract.liquidate(
      userAddress,
      tokenAddress[collateral],
      parseUnits(soilAmount.toString())
    );
    console.log("liquidate result", result);
  };

  return { liquidate };
}
