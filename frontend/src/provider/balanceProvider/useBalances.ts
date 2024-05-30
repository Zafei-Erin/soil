import { useContext } from "react";

import { BalanceContext } from "./balanceProvider";

export const useBalances = () => {
  const balanceContext = useContext(BalanceContext);
  if (!balanceContext) {
    throw new Error(
      "balance context has to be used within <BalanceContext.Provider>"
    );
  }
  return balanceContext;
};
