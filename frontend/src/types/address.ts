const WETHAddress = import.meta.env.VITE_WETH;
const DAIAddress = import.meta.env.VITE_DAI;
const SOILAddress = import.meta.env.VITE_SOIL;

export const Token = ["WETH", "DAI", "SOIL"] as const;
export type Token = (typeof Token)[number];

export const DepositToken = Token.filter((token) => token !== "SOIL");
export type DepositToken = Exclude<Token, "SOIL">;

export const tokenAddress: Record<Token, string> = {
  WETH: WETHAddress,
  DAI: DAIAddress,
  SOIL: SOILAddress,
};
