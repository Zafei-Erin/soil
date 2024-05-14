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

type Position = {
  deposited: number;
  borrowed: number;
};

const DEFAULT_POSITION: Position = {
  deposited: 0,
  borrowed: 0,
};

export function usePosition() {
  const [position, setPosition] = useState<Position>(DEFAULT_POSITION);
  const { isConnected, address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const fetchPosition = async (walletProvider: Eip1193Provider) => {
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const contract = new Contract(tokenAddress["SOIL"], SOIL.abi, signer);
    const result = await contract.getAccountInformationValue(address);
    console.log("position: ", result);

    const borrowed = parseFloat(formatUnits(result[0], 18));
    const deposited = parseFloat(formatUnits(result[1], 18));
    console.log("position: ", deposited, borrowed);
    setPosition({ deposited, borrowed });
  };

  const refreshPosition = () => {
    if (!isConnected || !walletProvider) {
      return;
    }
    fetchPosition(walletProvider);
  };

  useEffect(() => {
    refreshPosition();
  }, [isConnected, walletProvider]);

  return { position, refreshPosition };
}
