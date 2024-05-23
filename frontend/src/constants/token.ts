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
    SOIL: "0xcA69f332B143f4D39cCF4dc395F33F40c0fA0a5E",
  },
  [ChainID.Optimism]: {
    WETH: "0x387FD5E4Ea72cF66f8eA453Ed648e64908f64104",
    DAI: "0xaf9B15aA0557cff606a0616d9B76B94887423022",
    SOIL: "0xe561dc0f64A9f02a532B41e23dB8BBCD0b6285a7",
  },
  [ChainID.Avalanche]: {
    WETH: "",
    DAI: "",
    SOIL: "0xa6646Ef4b5d51D92aCF9811e85C2E0B36776249e",
  },
};
