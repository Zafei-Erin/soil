import { Token } from "@/types/address";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { useEffect, useState } from "react";
import PriceFeed from "@/abis/PriceFeed.json";
import { JsonRpcSigner } from "ethers";
import { DEFAULT_PRICES, Prices, priceAddress } from "@/types/price";
import { Eip1193Provider } from "ethers";

export function usePrices() {
  const [prices, setPrices] = useState<Prices>(DEFAULT_PRICES);
  const { isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const fetchPrice = async (signer: JsonRpcSigner, token: Token) => {
    const contract = new Contract(priceAddress[token], PriceFeed.abi, signer);
    const result = await contract.latestRoundData();
    const price = parseFloat(formatUnits(result[1], 8));
    return price;
  };

  const fetchPrices = async (walletProvider: Eip1193Provider) => {
    const newPrices = { ...DEFAULT_PRICES };

    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    for (const token of Token) {
      await fetchPrice(signer, token).then(
        (price) => (newPrices[token] = price)
      );
    }
    setPrices(newPrices);
  };

  const refreshPrices = () => {
    if (!isConnected || !walletProvider) {
      // console.log("refresh prices failed");
      return;
    }
    fetchPrices(walletProvider);
    // console.log("refresh prices success");
  };

  useEffect(() => {
    refreshPrices();
    setInterval(refreshPrices, 60 * 1000);
  }, [isConnected, walletProvider]);

  return { prices, refreshPrices };
}
