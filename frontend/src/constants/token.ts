const WETHAddress = import.meta.env.VITE_WETH;
const DAIAddress = import.meta.env.VITE_DAI;
const SOILAddress = import.meta.env.VITE_SOIL;

export const DepositToken = ["WETH", "DAI"] as const;
export type DepositToken = (typeof DepositToken)[number];

export const Token = [...DepositToken, "SOIL"] as const;
export type Token = (typeof Token)[number];

export const tokenAddress: Record<Token, string> = {
  WETH: WETHAddress,
  DAI: DAIAddress,
  SOIL: SOILAddress,
};
