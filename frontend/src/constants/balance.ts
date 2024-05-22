import { Token } from "./token";

export type Balances = {
  [token in Token]: number;
};
export const DEFAULT_BALANCES: Balances = {
  DAI: 0,
  WETH: 0,
  SOIL: 0,
};
