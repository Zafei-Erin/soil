import SOIL from "@/abis/SOIL.json";
import { Collaterals, DEFAULT_COLLATERALS } from "@/constants/collateral";
import { DepositToken, TokenAddress } from "@/constants/token";
import { isValidChain } from "@/lib/utils";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, JsonRpcSigner, formatUnits } from "ethers";
import { useCallback, useEffect, useState } from "react";

export function useCollaterals() {
  const [collaterals, setCollaterals] =
    useState<Collaterals>(DEFAULT_COLLATERALS);
  const { isConnected, address, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const fetchCollateral = async (
    signer: JsonRpcSigner,
    soilAddress: string,
    tokenAddress: string,
    address: string
  ) => {
    const contract = new Contract(soilAddress, SOIL.abi, signer);
    const result = await contract.getAccountCollateralAmount(
      address,
      tokenAddress
    );
    const collateral = parseFloat(formatUnits(result));
    return collateral;
  };

  const refreshCollaterals = useCallback(async () => {
    if (!isConnected || !walletProvider || !address) {
      throw Error("User disconnected");
    }

    if (!chainId || !isValidChain(chainId)) {
      throw Error("Chain not support");
    }

    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();

    const newCollaterals = { ...DEFAULT_COLLATERALS };
    for (const token of DepositToken) {
      const soilAddress = TokenAddress[chainId].SOIL;
      const tokenAddress = TokenAddress[chainId][token];
      const collateral = await fetchCollateral(
        signer,
        soilAddress,
        tokenAddress,
        address
      );
      newCollaterals[token] = collateral;
    }
    setCollaterals(newCollaterals);
  }, [isConnected, walletProvider, chainId, address]);

  useEffect(() => {
    refreshCollaterals();
  }, [refreshCollaterals]);

  return { collaterals, refreshCollaterals };
}
