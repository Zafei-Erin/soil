import { Token } from "./token";

export const ChainID = {
  POLYGON: 80002,
  AVALANCHE: 43113,
  OPTIMISM: 11155420,
} as const;
export type ChainID = (typeof ChainID)[keyof typeof ChainID];

type TokenAddress = {
  [token in Token]: string;
};

// to mint token on chains
export const Chain: Record<ChainID, TokenAddress> = {
  [ChainID.POLYGON]: {
    WETH: "0x387FD5E4Ea72cF66f8eA453Ed648e64908f64104",
    DAI: "0xaf9B15aA0557cff606a0616d9B76B94887423022",
    SOIL: "0x5c07A6f29ab112d2797934c74019A04b2254A5C1",
  },
  [ChainID.OPTIMISM]: {
    WETH: "0x387FD5E4Ea72cF66f8eA453Ed648e64908f64104",
    DAI: "0xaf9B15aA0557cff606a0616d9B76B94887423022",
    SOIL: "0x844931f15983709d6edA57ec93FC23160ACd87EF",
  },
  [ChainID.AVALANCHE]: {
    WETH: "",
    DAI: "",
    SOIL: "0x60f2bC29fc6742bceA772880b3Eb3A82fC68a9D2",
  },
};
