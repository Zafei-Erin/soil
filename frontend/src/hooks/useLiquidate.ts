import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, parseUnits } from "ethers";

import SOIL from "@/abis/SOIL.json";
import { LiquidateInfo } from "@/routes/liquidate/LiquidateCard";
import { TokenAddress } from "@/constants/token";
import { isValidChain } from "@/lib/utils";

export function useLiquidate() {
  const { isConnected, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const liquidate = async ({
    userAddress,
    collateral,
    soilAmount,
  }: LiquidateInfo) => {
    if (!isConnected || !walletProvider) {
      throw Error("User disconnected");
    }

    if (!chainId || !isValidChain(chainId)) {
      throw Error("Chain not support");
    }

    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();

    const soilAddress = TokenAddress[chainId].SOIL;
    const tokenAddress = TokenAddress[chainId][collateral];
    const contract = new Contract(soilAddress, SOIL.abi, signer);
    await contract.liquidate(
      userAddress,
      tokenAddress,
      parseUnits(soilAmount.toString())
    );
  };

  return { liquidate };
}
