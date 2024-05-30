import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { useCallback, useEffect, useState } from "react";

import SOIL from "@/abis/SOIL.json";
import { DEFAULT_POSITION, Position, TokenAddress } from "@/constants";
import { isValidChain } from "@/lib/utils";

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
    setPosition({ deposited, borrowed });
  }, [isConnected, walletProvider, chainId, address]);

  useEffect(() => {
    const init = async () => {
      try {
        await refreshPosition();
      } catch (error) {
        return;
      }
    };
    init();
  }, [refreshPosition, isConnected]);

  return { position, refreshPosition };
}
