import PriceFeed from "@/abis/PriceFeed.json";
import SOIL from "@/abis/SOIL.json";
import { ChainID } from "@/constants/chainId";

import {
  DEFAULT_PRICES_ON_CHAIN,
  PricesOnChain,
  priceAddress,
} from "@/constants/price";
import { Token, TokenAddress } from "@/constants/token";
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
import Web3 from "web3";

const INFURA_API_KEY = import.meta.env.VITE_INFURA_OPTIMISM_ENDPOINT;

type PriceContext = {
  prices: PricesOnChain;
};

export const PriceContext = createContext<PriceContext>({
  prices: DEFAULT_PRICES_ON_CHAIN,
});

export const PriceProvider = ({ children }: { children: ReactNode }) => {
  const [prices, setPrices] = useState<PricesOnChain>(DEFAULT_PRICES_ON_CHAIN);
  const { isConnected, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const fetchPrice = async (web3: Web3, token: Token) => {
    const contract = new web3.eth.Contract(PriceFeed.abi, priceAddress[token]);
    const result = await contract.methods.latestRoundData().call();
    if (result) {
      const price = parseFloat(formatUnits(result[1], 8));
      return price;
    }
    return DEFAULT_PRICES_ON_CHAIN[token];
  };

  const fetchSOILOnChain = useCallback(async () => {
    if (!isConnected || !walletProvider) {
      console.log("User disconnected");
      return DEFAULT_PRICES_ON_CHAIN.SOIL_ON_CHAIN;
    }
    if (!chainId || !isValidChain(chainId) || chainId == ChainID.Optimism) {
      console.log("Chain not support");
      return DEFAULT_PRICES_ON_CHAIN.SOIL_ON_CHAIN;
    }
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();

    const contract = new Contract(TokenAddress[chainId].SOIL, SOIL.abi, signer);
    const result = await contract.getCrudeOilPrice();
    const price = parseFloat(formatUnits(result));
    return price;
  }, [chainId, isConnected, walletProvider]);

  const fetchPrices = useCallback(async () => {
    const newPrices = { ...DEFAULT_PRICES_ON_CHAIN };
    const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_API_KEY));

    // price on optimism
    for (const token of Token) {
      await fetchPrice(web3, token)
        .then((price) => (newPrices[token] = price))
        .catch((error) => console.log(error));
    }

    // price of soil on current chain
    await fetchSOILOnChain()
      .then((price) => (newPrices.SOIL_ON_CHAIN = price))
      .catch((error) => console.log(error));

    setPrices(newPrices);
  }, [fetchSOILOnChain]);

  useEffect(() => {
    fetchPrices();
    const intervalId = setInterval(fetchPrices, 60 * 1000);
    return () => clearInterval(intervalId);
  }, [fetchPrices]);

  return (
    <PriceContext.Provider value={{ prices }}>{children}</PriceContext.Provider>
  );
};
