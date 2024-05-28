import SOIL from "@/abis/SOIL.json";

import { TokenAddress } from "@/constants/token";
import { isValidChain } from "@/lib/utils";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useBalances } from "../balanceProvider";

type HealthFactorContext = {
  healthFactor: number;
  refreshHealthFactor: () => Promise<void>;
};

export const HealthFactorContext = createContext<HealthFactorContext | null>(
  null
);

export const HealthFactorProvider = ({ children }: { children: ReactNode }) => {
  const [healthFactor, setHealthFactor] = useState<number>(0);
  const { isConnected, address, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const { getBalances } = useBalances();
  const soilBalance = getBalances("SOIL");

  const refreshHealthFactor = useCallback(async () => {
    if (!isConnected || !walletProvider || !address) {
      throw Error("User disconnected");
    }

    if (!chainId || !isValidChain(chainId)) {
      throw Error("Chain not support");
    }

    if (soilBalance == 0) {
      setHealthFactor(0);
      return;
    }

    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const soilAddress = TokenAddress[chainId].SOIL;
    const contract = new Contract(soilAddress, SOIL.abi, signer);
    const result = await contract.getHealthFactor(address);
    const data = parseFloat(formatUnits(result, 18));
    const healthFactor = data > 1_000_000 ? Infinity : data;

    setHealthFactor(healthFactor);
  }, [isConnected, walletProvider, address, chainId, soilBalance]);

  useEffect(() => {
    // init
    if (!isConnected) {
      return;
    }
    refreshHealthFactor();
  }, [refreshHealthFactor, isConnected]);

  return (
    <HealthFactorContext.Provider value={{ healthFactor, refreshHealthFactor }}>
      {children}
    </HealthFactorContext.Provider>
  );
};
