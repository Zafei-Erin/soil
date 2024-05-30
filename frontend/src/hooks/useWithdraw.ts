import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, parseUnits } from "ethers";

import SOIL from "@/abis/SOIL.json";
import { DepositToken, TokenAddress } from "@/constants";
import { isValidChain } from "@/lib/utils";

export function useWithDraw() {
  const { isConnected, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const withDraw = async (
    withDrawToken: DepositToken,
    withDrawAmount: number
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
    const tokenAddress = TokenAddress[chainId][withDrawToken];
    const contract = new Contract(soilAddress, SOIL.abi, signer);
    await contract.redeem(tokenAddress, parseUnits(withDrawAmount.toString()));
  };

  return { withDraw };
}
