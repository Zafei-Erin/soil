import { Token, tokenAddress } from "@/types/address";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { useEffect, useState } from "react";
import { JsonRpcSigner } from "ethers";
import { Eip1193Provider } from "ethers";
import { Balances, DEFAULT_BALANCES } from "@/types/balance";
import ERC20 from "@/abis/ERC20.json";

export function useFetchBalances() {
  const [balances, setBalances] = useState<Balances>(DEFAULT_BALANCES);
  const { isConnected, address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const fetchBalance = async (signer: JsonRpcSigner, token: Token) => {
    const contract = new Contract(tokenAddress[token], ERC20.abi, signer);
    const result = await contract.balanceOf(address);
    const price = parseFloat(formatUnits(result));
    return price;
  };

  const fetchBalances = async (walletProvider: Eip1193Provider) => {
    const newBalances = { ...DEFAULT_BALANCES };

    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    for (const token of Token) {
      await fetchBalance(signer, token).then(
        (balance) => (newBalances[token] = balance)
      );
    }
    setBalances(newBalances);
  };

  const refreshBalances = () => {
    if (!isConnected || !walletProvider) {
      return;
    }
    fetchBalances(walletProvider);
  };

  useEffect(() => {
    refreshBalances();
  }, [isConnected, walletProvider]);

  const getBalances = (token: Token) => {
    return balances[token];
  };

  return { getBalances, balances, refreshBalances };
}
