import { useContext } from "react";

import { PriceContext } from "./PriceProvider";

export const usePrices = () => {
  const priceContext = useContext(PriceContext);
  if (!priceContext) {
    throw new Error(
      "price context has to be used within <PriceContext.Provider>"
    );
  }
  return priceContext;
};
