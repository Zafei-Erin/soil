import { Balances, DEFAULT_BALANCES } from "@/constants/balance";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { Contract, formatUnits } from "ethers";
import { JsonRpcSigner } from "ethers";
import { ReactNode, createContext, useEffect, useState } from "react";
import ERC20 from "@/abis/ERC20.json";
import { Chain, ChainIDs } from "@/constants/chain";
import { BrowserProvider } from "ethers";
import { Token } from "@/constants/token";

type BalanceContext = {
  getBalances: (token: Token) => number;
  refreshBalances: () => Promise<void>;
};

export const BalanceContext = createContext<BalanceContext | null>(null);

export const BalanceProvider = ({ children }: { children: ReactNode }) => {
  const [balances, setBalances] = useState<Balances>(DEFAULT_BALANCES);
  const { isConnected, address, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const fetchBalance = async (signer: JsonRpcSigner, tokenAddress: string) => {
    const contract = new Contract(tokenAddress, ERC20.abi, signer);
    const result = await contract.balanceOf(address);
    const price = parseFloat(formatUnits(result));
    return price;
  };

  const refreshBalances = async () => {
    if (!isConnected || !walletProvider || !chainId) {
      throw Error("User disconnected");
    }

    const chain = ChainIDs.find((c) => chainId === c);
    if (!chain) {
      throw Error("Chain not support");
    }

    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();

    const newBalances = { ...DEFAULT_BALANCES };
    for (const token of Token) {
      const tokenAddress = Chain[chain][token];
      await fetchBalance(signer, tokenAddress).then(
        (balance) => (newBalances[token] = balance)
      );
    }
    setBalances(newBalances);
  };

  useEffect(() => {
    refreshBalances();
  }, [isConnected, walletProvider, chainId]);

  const getBalances = (token: Token) => {
    return balances[token];
  };
  return (
    <BalanceContext.Provider value={{ getBalances, refreshBalances }}>
      {children}
    </BalanceContext.Provider>
  );
};
