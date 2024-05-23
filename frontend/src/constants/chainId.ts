import { Chain } from "./chain";

export const SourceChainID = {
  [Chain.OPTIMISM]: 11155420,
} as const;
export type SourceChainID = (typeof SourceChainID)[keyof typeof SourceChainID];

export const DestinationChainID = {
  [Chain.POLYGON]: 80002,
  [Chain.AVALANCHE]: 43113,
} as const;
export type DestinationChainID =
  (typeof DestinationChainID)[keyof typeof DestinationChainID];

export const ChainID = {
  ...SourceChainID,
  ...DestinationChainID,
} as const;
export type ChainID = (typeof ChainID)[keyof typeof ChainID];

type ChainInfo = {
  chainId: ChainID;
  name: string;
  token: string;
};

export const ChainInfo: Record<ChainID, ChainInfo> = {
  [ChainID.Polygon]: {
    chainId: ChainID.Polygon,
    name: "Polygon",
    token: "MATIC",
  },
  [ChainID.Avalanche]: {
    chainId: ChainID.Avalanche,
    name: "Avalanche",
    token: "AVAX",
  },
  [ChainID.Optimism]: {
    chainId: ChainID.Optimism,
    name: "Optimism",
    token: "ETH",
  },
};
