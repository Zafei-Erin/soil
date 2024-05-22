export const ChainID = {
  POLYGON: 80002,
  AVALANCHE: 43113,
  OPTIMISM: 11155420,
} as const;
export type ChainID = (typeof ChainID)[keyof typeof ChainID];

export const ChainIDs = [
  ChainID.AVALANCHE,
  ChainID.OPTIMISM,
  ChainID.POLYGON,
] as const;
export type ChainIDs = (typeof ChainIDs)[number];
