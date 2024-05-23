import { Token } from "./token";

// on optimism chain
export const priceAddress: Record<Token, string> = {
  WETH: "0x61Ec26aA57019C486B10502285c5A3D4A4750AD7",
  DAI: "0x4beA21743541fE4509790F1606c37f2B2C312479",
  SOIL: "0x43B6b749Ec83a69Bb87FD9E2c2998b4a083BC4f4",
};

export type Prices = {
  [token in Token]: number;
};

export const DEFAULT_PRICES: Prices = {
  DAI: 0,
  WETH: 0,
  SOIL: 0,
};

export type PricesOnChain = {
  [token in Token]: number;
} & {
  SOIL_ON_CHAIN: number;
};

export const DEFAULT_PRICES_ON_CHAIN: PricesOnChain = {
  DAI: 0,
  WETH: 0,
  SOIL: 0,
  SOIL_ON_CHAIN: 0,
};
