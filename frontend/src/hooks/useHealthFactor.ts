import SOIL from "@/abis/SOIL.json";
import { tokenAddress } from "@/types/address";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import {
  BrowserProvider,
  Contract,
  Eip1193Provider,
  formatUnits,
} from "ethers";
import { useEffect, useState } from "react";

export function useHealthFactor() {
  const [healthFactor, setHealthFactor] = useState<number>(0);
  const { isConnected, address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const fetchHealthFactor = async (walletProvider: Eip1193Provider) => {
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const contract = new Contract(tokenAddress["SOIL"], SOIL.abi, signer);
    const result = await contract.getHealthFactor(address);
    const healthFactor = parseFloat(formatUnits(result, 18));
    console.log("health factor", healthFactor);
    setHealthFactor(healthFactor);
  };

  const refreshHealthFactor = () => {
    if (!isConnected || !walletProvider) {
      return;
    }
    fetchHealthFactor(walletProvider);
  };

  useEffect(() => {
    refreshHealthFactor();
  }, [isConnected, walletProvider]);

  return { healthFactor, refreshHealthFactor };
}
