export const Token = {
  SOIL: "SOIL",
  WETH: "WETH",
  DAI: "DAI",
} as const;
export type Token = (typeof Token)[keyof typeof Token];
export const Tokens: Token[] = Object.values(Token);
