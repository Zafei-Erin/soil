export const Chain = {
  Polygon: "Polygon",
  Avalanche: "Avalanche",
  Optimism: "Optimism",
} as const;
export type Chain = (typeof Chain)[keyof typeof Chain];
export const Chains: Chain[] = Object.values(Chain);

export const ChainID: Record<Chain, number> = {
  [Chain.Avalanche]: 43113,
  [Chain.Polygon]: 80002,
  [Chain.Optimism]: 11155420,
};
