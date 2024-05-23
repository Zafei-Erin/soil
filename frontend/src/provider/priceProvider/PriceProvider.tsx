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
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { formatUnits } from "ethers";
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
  const { chainId } = useWeb3ModalAccount();

  const fetchPrice = async (web3: Web3, token: Token) => {
    const contract = new web3.eth.Contract(PriceFeed.abi, priceAddress[token]);
    const result = await contract.methods.latestRoundData().call();
    if (result) {
      const price = parseFloat(formatUnits(result[1], 8));
      return price;
    }
    return 0;
  };

  const fetchSOILOnChain = async (web3: Web3, chain: ChainID) => {
    const contract = new web3.eth.Contract(SOIL.abi, TokenAddress[chain].SOIL);
    const result = await contract.methods.getCrudeOilPrice().call();
    if (result) {
      const price = parseFloat(formatUnits(result[1], 8));
      return price;
    }
    return 0;
  };

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
    const chain = chainId && isValidChain(chainId) ? chainId : ChainID.Optimism;
    await fetchSOILOnChain(web3, chain)
      .then((price) => (newPrices.SOIL_ON_CHAIN = price))
      .catch((error) => console.log(error));

    setPrices(newPrices);
  }, [chainId]);

  useEffect(() => {
    fetchPrices();
    const intervalId = setInterval(fetchPrices, 60 * 1000);
    return () => clearInterval(intervalId);
  }, [fetchPrices]);

  return (
    <PriceContext.Provider value={{ prices }}>{children}</PriceContext.Provider>
  );
};
