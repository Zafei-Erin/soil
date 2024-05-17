import SOIL from "@/abis/SOIL.json";
import { DepositToken, tokenAddress } from "@/types/address";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, parseUnits } from "ethers";

export function useWithDraw() {
  const { isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const withDraw = async (
    withDrawToken: DepositToken,
    withDrawAmount: number
  ) => {
    if (!isConnected || !walletProvider) {
      return;
    }
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const contract = new Contract(tokenAddress["SOIL"], SOIL.abi, signer);
    const result = await contract.redeem(
      tokenAddress[withDrawToken],
      parseUnits(withDrawAmount.toString())
    );
    console.log("redeem result", result);
  };

  return { withDraw };
}
