import PriceFeed from "@/abis/PriceFeed.json";
import { DepositToken, Token } from "@/types/address";
import { DEFAULT_PRICES, Prices, priceAddress } from "@/types/price";
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
  prices: Prices;
};

export const PriceContext = createContext<PriceContext>({
  prices: DEFAULT_PRICES,
});

export const PriceProvider = ({ children }: { children: ReactNode }) => {
  const [prices, setPrices] = useState<Prices>(DEFAULT_PRICES);

  const fetchPrice = async (web3: Web3, token: Token) => {
    const contract = new web3.eth.Contract(PriceFeed.abi, priceAddress[token]);
    const result = await contract.methods.latestRoundData().call();
    if (result) {
      const price = parseFloat(formatUnits(result[1], 8));
      return price;
    }
    return 0;
  };

  const fetchPrices = useCallback(async () => {
    const newPrices = { ...DEFAULT_PRICES };
    const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_API_KEY));

    for (const token of DepositToken) {
      await fetchPrice(web3, token)
        .then((price) => (newPrices[token] = price))
        .catch((error) => console.log(error));
    }
    setPrices(newPrices);
  }, []);

  useEffect(() => {
    fetchPrices();
    const intervalId = setInterval(fetchPrices, 60 * 1000);
    return () => clearInterval(intervalId);
  }, [fetchPrices]);

  return (
    <PriceContext.Provider value={{ prices }}>{children}</PriceContext.Provider>
  );
};
