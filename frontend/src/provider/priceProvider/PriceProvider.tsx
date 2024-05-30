import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { DEFAULT_PRICES, Prices } from "@/constants/price";

type PriceContext = {
  prices: Prices;
};

export const PriceContext = createContext<PriceContext>({
  prices: DEFAULT_PRICES,
});

export const PriceProvider = ({ children }: { children: ReactNode }) => {
  const [prices, setPrices] = useState<Prices>(DEFAULT_PRICES);

  const refreshPrices = useCallback(async () => {
    const response = await fetch(`${import.meta.env.VITE_SERVER}/price`);
    const data = await response.json();
    setPrices(data);
  }, []);

  useEffect(() => {
    refreshPrices();
    const intervalId = setInterval(refreshPrices, 60 * 1000);
    return () => clearInterval(intervalId);
  }, [refreshPrices]);

  return (
    <PriceContext.Provider value={{ prices }}>{children}</PriceContext.Provider>
  );
};
