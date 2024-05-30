import { useContext } from "react";

import { HealthFactorContext } from "./HealthFactorProvider";

export const useHealthFactor = () => {
  const healthFactorContext = useContext(HealthFactorContext);
  if (!healthFactorContext) {
    throw new Error(
      "price context has to be used within <PriceContext.Provider>"
    );
  }
  return healthFactorContext;
};
