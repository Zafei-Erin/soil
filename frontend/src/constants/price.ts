import { Token } from "./token";

// on optimism chain
export const priceAddress: Record<Token, string> = {
  WETH: "0x61Ec26aA57019C486B10502285c5A3D4A4750AD7",
  DAI: "0x4beA21743541fE4509790F1606c37f2B2C312479",
  SOIL: "",
};

export type Prices = {
  [token in Token]: number;
};
export const DEFAULT_PRICES: Prices = {
  DAI: 0,
  WETH: 0,
  SOIL: 0,
};
