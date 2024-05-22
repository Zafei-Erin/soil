export const ChainID = {
  POLYGON: 80002,
  AVALANCHE: 43113,
  OPTIMISM: 11155420,
} as const;
export type ChainID = (typeof ChainID)[keyof typeof ChainID];
