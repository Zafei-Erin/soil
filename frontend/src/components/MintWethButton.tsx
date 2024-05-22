import { BrowserProvider, Contract, formatUnits, parseUnits } from "ethers";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";

import { Button } from "./ui/button";
import ERC20 from "@/abis/ERC20.json";
import { toast } from "./ui/use-toast";
import { Chain, ChainID } from "@/constants/chain";

const MintWethButton = () => {
  const { isConnected, address, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const mintWETH = async () => {
    if (!isConnected || !walletProvider || !chainId) {
      throw Error("User disconnected");
    }

    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();

    const WETHAddress = Chain[chainId as ChainID].WETH;
    const contract = new Contract(WETHAddress, ERC20.abi, signer);
    const txn = await contract.mint(address, parseUnits("16"));
    txn.wait();
    toast({
      duration: 1500,
      title: "Mint Successfully",
    });

    const balance = await contract.balanceOf(address);
    console.log("balance aft mint: ", formatUnits(balance, 18));
  };

  return <Button onClick={mintWETH}>Mint WETH</Button>;
};
export default MintWethButton;
