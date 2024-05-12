import { BrowserProvider, Contract } from "ethers";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";

import { Button } from "./ui/button";
import WETH from "@/abis/WETH.json";

const MintWethButton = () => {
  const { isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const WETHAddress = import.meta.env.VITE_WETH;
  const mintWETH = async () => {
    if (!isConnected || !walletProvider) throw Error("User disconnected");

    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();

    const contract = new Contract(WETHAddress, WETH.abi, signer);
    const txn = await contract.mint();
    txn.wait();
  };

  return <Button onClick={mintWETH}>Mint WETH</Button>;
};
export default MintWethButton;
