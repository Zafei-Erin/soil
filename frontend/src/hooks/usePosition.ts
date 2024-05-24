import SOIL from "@/abis/SOIL.json";
import { DEFAULT_POSITION, Position } from "@/constants/position";
import { TokenAddress } from "@/constants/token";
import { isValidChain } from "@/lib/utils";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { useCallback, useEffect, useState } from "react";

export function usePosition() {
  const [position, setPosition] = useState<Position>(DEFAULT_POSITION);
  const { isConnected, address, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const refreshPosition = useCallback(async () => {
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
    const result = await contract.getAccountInformationValue(address);

    const borrowed = parseFloat(formatUnits(result[0], 18));
    const deposited = parseFloat(formatUnits(result[1], 18));
    console.log("position: ", deposited, borrowed);
    setPosition({ deposited, borrowed });
  }, [isConnected, walletProvider, chainId, address]);

  useEffect(() => {
    refreshPosition();
  }, [refreshPosition]);

  return { position, refreshPosition };
}
