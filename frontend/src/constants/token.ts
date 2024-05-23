import { ChainID } from "./chainId";

export const DepositToken = ["WETH", "DAI"] as const;
export type DepositToken = (typeof DepositToken)[number];

export const Token = [...DepositToken, "SOIL"] as const;
export type Token = (typeof Token)[number];

export type TokenAddress = {
  [token in Token]: string;
};

// to mint token on chains
export const TokenAddress: Record<ChainID, TokenAddress> = {
  [ChainID.Polygon]: {
    WETH: "0x387FD5E4Ea72cF66f8eA453Ed648e64908f64104",
    DAI: "0xaf9B15aA0557cff606a0616d9B76B94887423022",
    SOIL: "0x5c07A6f29ab112d2797934c74019A04b2254A5C1",
  },
  [ChainID.Optimism]: {
    WETH: "0x387FD5E4Ea72cF66f8eA453Ed648e64908f64104",
    DAI: "0xaf9B15aA0557cff606a0616d9B76B94887423022",
    SOIL: "0x844931f15983709d6edA57ec93FC23160ACd87EF",
  },
  [ChainID.Avalanche]: {
    WETH: "",
    DAI: "",
    SOIL: "0x60f2bC29fc6742bceA772880b3Eb3A82fC68a9D2",
  },
};
