import { Token } from "./token";

const WETHPriceAddress = import.meta.env.VITE_WETH_PRICE;
const DAIPriceAddress = import.meta.env.VITE_DAI_PRICE;
const SOILPriceAddress = import.meta.env.VITE_SOIL_PRICE;

export const priceAddress: Record<Token, string> = {
  WETH: WETHPriceAddress,
  DAI: DAIPriceAddress,
  SOIL: SOILPriceAddress,
};

export type Prices = {
  [token in Token]: number;
};
export const DEFAULT_PRICES: Prices = {
  DAI: 0,
  WETH: 0,
  SOIL: 0,
};
