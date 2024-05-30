export const SourceChain = {
  OPTIMISM: "Optimism",
} as const;
export type SourceChain = (typeof SourceChain)[keyof typeof SourceChain];

export const DestinationChain = {
  AVALANCHE: "Avalanche",
  POLYGON: "Polygon",
} as const;
export type DestinationChain =
  (typeof DestinationChain)[keyof typeof DestinationChain];

export const Chain = {
  ...SourceChain,
  ...DestinationChain,
};
export type Chain = (typeof Chain)[keyof typeof Chain];
export const Chains = Object.values(Chain)