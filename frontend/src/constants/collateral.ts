import { DepositToken } from "./token";

export type Collaterals = {
  [token in DepositToken]: number;
};
export const DEFAULT_COLLATERALS: Collaterals = {
  DAI: 0,
  WETH: 0,
};
