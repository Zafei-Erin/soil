import { Token } from "./token";

export const ReceiverAddress = {
  Polygon: "0x98243Ace02e8bF668f7a565b5bc6E79BF584a768",
  Avalanche: "0xd6a80097825cB7957bD8bdA9676f8aDae35265BC",
};

// on optimism chain
export const priceAddress: Record<Token, string> = {
  WETH: "0x61Ec26aA57019C486B10502285c5A3D4A4750AD7",
  DAI: "0x4beA21743541fE4509790F1606c37f2B2C312479",
  SOIL: "0x43B6b749Ec83a69Bb87FD9E2c2998b4a083BC4f4",
};
