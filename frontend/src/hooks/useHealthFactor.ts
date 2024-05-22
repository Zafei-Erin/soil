import SOIL from "@/abis/SOIL.json";
import { TokenAddress } from "@/constants/token";
import { isValidChain } from "@/lib/utils";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { useEffect, useState } from "react";

export function useHealthFactor() {
  const [healthFactor, setHealthFactor] = useState<number>(0);
  const { isConnected, address, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const refreshHealthFactor = async () => {
    if (!isConnected || !walletProvider || !address) {
      throw Error("User disconnected");
    }

    if (!chainId || !isValidChain(chainId)) {
      throw Error("Chain not support");
    }
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const soilAddress = TokenAddress[chainId].SOIL;
    const contract = new Contract(soilAddress, SOIL.abi, signer);
    const result = await contract.getHealthFactor(address);
    const healthFactor = parseFloat(formatUnits(result, 18));
    console.log("health factor", healthFactor);
    setHealthFactor(healthFactor);
  };

  useEffect(() => {
    refreshHealthFactor();
  }, [isConnected, walletProvider]);

  return { healthFactor, refreshHealthFactor };
}
