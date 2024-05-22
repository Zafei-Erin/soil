import { DepositToken, Token, tokenAddress } from "@/constants/token";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { useEffect, useState } from "react";
import { JsonRpcSigner } from "ethers";
import { Eip1193Provider } from "ethers";
import ERC20 from "@/abis/ERC20.json";
import { Collaterals, DEFAULT_COLLATERALS } from "@/constants/collateral";

export function useCollaterals() {
  const [collaterals, setCollaterals] =
    useState<Collaterals>(DEFAULT_COLLATERALS);
  const { isConnected, address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const fetchCollateral = async (signer: JsonRpcSigner, token: Token) => {
    const contract = new Contract(tokenAddress[token], ERC20.abi, signer);
    const result = await contract.getAccountCollateralAmount(
      address,
      tokenAddress[token]
    );
    const price = parseFloat(formatUnits(result));
    return price;
  };

  const fetchCollaterals = async (walletProvider: Eip1193Provider) => {
    const newCollaterals = { ...DEFAULT_COLLATERALS };
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    for (const token of DepositToken) {
      await fetchCollateral(signer, token).then(
        (collateral) => (newCollaterals[token] = collateral)
      );
    }
    setCollaterals(newCollaterals);
  };

  const refreshCollaterals = () => {
    if (!isConnected || !walletProvider || !address) {
      return;
    }
    fetchCollaterals(walletProvider);
  };

  useEffect(() => {
    refreshCollaterals();
  }, [isConnected, walletProvider]);

  return { collaterals, refreshCollaterals };
}
