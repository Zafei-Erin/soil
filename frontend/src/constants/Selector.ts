import { parseUnits } from "ethers";
import { DestinationChainID } from "./chainId";

export const Selector: Record<DestinationChainID, bigint> = {
  [DestinationChainID.Polygon]: parseUnits("16281711391670634445"),
  [DestinationChainID.Avalanche]: parseUnits("14767482510784806043"),
} as const;

export type Selector = (typeof Selector)[keyof typeof Selector];
