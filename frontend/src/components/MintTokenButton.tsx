import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, parseUnits } from "ethers";

import ERC20 from "@/abis/ERC20.json";
import { DepositToken, TokenAddress } from "@/constants/token";
import { Loader } from "@/icons";
import { isValidChain } from "@/lib/utils";
import { useBalances } from "@/provider/balanceProvider";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

export const MintTokenButton = ({ token }: { token: DepositToken }) => {
  const { isConnected, address, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const { refreshBalances } = useBalances();
  const [loading, setLoading] = useState<boolean>(false);

  const disabled = !isConnected || !address || !chainId || loading;

  const mint = async () => {
    if (!isConnected || !walletProvider || !address) {
      throw Error("User disconnected");
    }

    if (!chainId || !isValidChain(chainId)) {
      throw Error("Chain not support");
    }
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();

    const contract = new Contract(
      TokenAddress[chainId][token],
      ERC20.abi,
      signer
    );
    const txn = await contract.mint(address, parseUnits("10"));
    txn.wait();
  };

  const mintWrapped = async () => {
    setLoading(true);
    try {
      await mint();
      refreshBalances();
      toast({
        duration: 1500,
        title: `Mint 10 ${token} Successfully`,
      });
    } catch (error) {
      toast({
        duration: 1500,
        title: `Mint ${token} Failed`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={mintWrapped}
      disabled={disabled}
      className="flex items-center justify-center gap-1"
    >
      Mint 10 {token}
      {loading && <Loader className="w-7 h-6 stroke-white fill-white" />}
    </Button>
  );
};
