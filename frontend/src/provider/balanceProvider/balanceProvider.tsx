import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, JsonRpcSigner, formatUnits } from "ethers";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import ERC20 from "@/abis/ERC20.json";
import {
  Balances,
  DEFAULT_BALANCES,
  Token,
  TokenAddress,
  Tokens,
} from "@/constants";
import { isValidChain } from "@/lib/utils";

type BalanceContext = {
  getBalances: (token: Token) => number;
  refreshBalances: () => Promise<void>;
};

export const BalanceContext = createContext<BalanceContext | null>(null);

const fetchBalance = async (
  signer: JsonRpcSigner,
  tokenAddress: string,
  address: string
) => {
  const contract = new Contract(tokenAddress, ERC20.abi, signer);
  const result = await contract.balanceOf(address);
  const price = parseFloat(formatUnits(result));
  return price;
};

export const BalanceProvider = ({ children }: { children: ReactNode }) => {
  const [balances, setBalances] = useState<Balances>(DEFAULT_BALANCES);
  const { isConnected, address, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const refreshBalances = useCallback(async () => {
    if (!isConnected || !walletProvider || !address) {
      throw Error("User disconnected");
    }

    if (!chainId || !isValidChain(chainId)) {
      throw Error("Chain not support");
    }

    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();

    const newBalances = { ...DEFAULT_BALANCES };
    for (const token of Tokens) {
      const tokenAddress = TokenAddress[chainId][token];
      const balance = await fetchBalance(signer, tokenAddress, address);
      newBalances[token] = balance;
    }
    setBalances(newBalances);
  }, [isConnected, walletProvider, chainId, address]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const init = async () => {
      try {
        await refreshBalances();
        intervalId = setInterval(refreshBalances, 60 * 1000);
      } catch (error) {
        return;
      }
    };
    init();

    return () => clearInterval(intervalId);
  }, [refreshBalances]);

  const getBalances = (token: Token) => {
    return balances[token];
  };
  
  return (
    <BalanceContext.Provider value={{ getBalances, refreshBalances }}>
      {children}
    </BalanceContext.Provider>
  );
};
