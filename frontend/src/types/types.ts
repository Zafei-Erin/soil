const WETHAddress = import.meta.env.VITE_WETH;
const DAIAddress = import.meta.env.VITE_DAI;
const SOILAddress = import.meta.env.VITE_SOIL;

export type Token = "WETH" | "DAI" | "SOIL";
export type DepositToken = Exclude<Token, "SOIL">;

export const address: Record<Token, string> = {
  WETH: WETHAddress,
  DAI: DAIAddress,
  SOIL: SOILAddress,
};
