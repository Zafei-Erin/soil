import { DestinationChainID } from "./chainId";

export const Selector: Record<DestinationChainID, bigint> = {
  [DestinationChainID.Polygon]: BigInt("16281711391670634445"),
  [DestinationChainID.Avalanche]: BigInt("14767482510784806043"),
} as const;

export type Selector = (typeof Selector)[keyof typeof Selector];
