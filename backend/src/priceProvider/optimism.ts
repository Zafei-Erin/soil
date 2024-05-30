import dotenv from "dotenv";
import { providers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import Web3 from "web3";

import { setInterval } from "timers";
import PriceFeed from "../abis/PriceFeed.json";
import { Token, Tokens, priceAddress } from "../constants";

type Price = {
  [token in Token]: number;
};

export const DEFAULT_PRICES: Price = {
  DAI: 0,
  WETH: 0,
  SOIL: 0,
};

export class OptimismPriceProvider {
  private static _PRICE: Price = DEFAULT_PRICES;

  public static get price() {
    return this._PRICE;
  }

  public static async init() {
    this.fetchPrices();
    setInterval(() => {
      this.fetchPrices();
    }, 60 * 1_000);
  }

  private static async fetchPrices() {
    for (const token of Tokens) {
      this._PRICE[token] = await this.fetchPrice(token);
    }
  }

  // query latest price of 3 tokens on optimism
  private static async fetchPrice(token: Token) {
    dotenv.config();
    const web3 = new Web3(
      new Web3.providers.HttpProvider(
        `https://optimism-sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
      )
    );
    const contract = new web3.eth.Contract(PriceFeed.abi, priceAddress[token]);
    const result = await contract.methods.latestRoundData().call();
    if (result) {
      const price = parseFloat(formatUnits(result[1], 8));
      return price;
    }
    return 0;
  }
}
