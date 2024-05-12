import { useEffect, useState } from "react";

const Tokens = ["WETH", "DAI", "SOIL"] as const;
type Token = (typeof Tokens)[number];
type Price = {
  [token in Token]: number;
};
const DEFAULT_PRICES: Price = {
  DAI: 0,
  WETH: 0,
  SOIL: 0,
};
export function useFetchPrice() {
  const [prices, setPrices] = useState<Price>(DEFAULT_PRICES);

  const fetchPrice = async (token: Token) => {
    if (token == "WETH") {
      return Math.random() * 300;
    }
    return Math.random() * 100;
  };

  const fetchPrices = () => {
    const newPrices = { ...DEFAULT_PRICES };
    for (const token of Tokens) {
      fetchPrice(token).then((price) => (newPrices[token] = price));
    }
    setPrices(newPrices);
  };

  useEffect(() => {
    // Fetch prices initially and then at regular intervals
    fetchPrices();
    setInterval(fetchPrices, 30 * 1000);
  }, []);

  const getPrice = (token: Token) => {
    return prices[token];
  };

  return { getPrice };
}
