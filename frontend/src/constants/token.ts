import { ChainID } from "./chainId";

export const DepositToken = {
  DAI: "DAI",
  WETH: "WETH",
} as const;
export type DepositToken = (typeof DepositToken)[keyof typeof DepositToken];

export const Token = {
  ...DepositToken,
  SOIL: "SOIL",
} as const;
export type Token = (typeof Token)[keyof typeof Token];

export const Tokens: Token[] = Object.values(Token);
export const DepositTokens: DepositToken[] = Object.values(DepositToken);

export type TokenAddress = {
  [token in Token]: string;
};

// to mint token on chains
export const TokenAddress: Record<ChainID, TokenAddress> = {
  [ChainID.Polygon]: {
    WETH: "0x387FD5E4Ea72cF66f8eA453Ed648e64908f64104",
    DAI: "0xaf9B15aA0557cff606a0616d9B76B94887423022",
    SOIL: "0x0cCe7D1668C3A72E8d5F6f3bDF7Bc6606f03D262",
  },
  [ChainID.Optimism]: {
    WETH: "0x387FD5E4Ea72cF66f8eA453Ed648e64908f64104",
    DAI: "0xaf9B15aA0557cff606a0616d9B76B94887423022",
    SOIL: "0x929072C633F56E61391cB183EFbb5f1dA86Dc56a",
  },
  [ChainID.Avalanche]: {
    WETH: "0x9991D14b93CD58fE8dD1A5a901608f18664225Ff",
    DAI: "0xC49E3c2b119026500cC442DA8D7c34316a1D3cF1",
    SOIL: "0x9774c3ed1dEC3F0829290E0616e2BFb1Cc26A75D",
  },
};
