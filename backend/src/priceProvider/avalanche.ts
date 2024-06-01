import dotenv from "dotenv";
import { Contract, providers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import Web3 from "web3";

import Receiver from "../abis/Receiver.json";
import { ReceiverAddress } from "../constants/address";
import { ChainID } from "../constants/chain";

export class AvalanchePriceProvider {
  private static _WS_PROVIDER: providers.WebSocketProvider;
  private static _PRICE: number;

  public static get WSProvider() {
    return this._WS_PROVIDER;
  }

  public static get price() {
    return this._PRICE;
  }

  public static async init() {
    this._PRICE = await this.fetchPrice();
    this.initWS();
    this.listenEvents();
  }

  // query public variable `s_oilPrice` at MessageReceiver
  private static async fetchPrice() {
    dotenv.config();
    const web3 = new Web3(
      new Web3.providers.HttpProvider(
        `https://avalanche-fuji.infura.io/v3/${process.env.INFURA_API_KEY}`
      )
    );
    const contract = new web3.eth.Contract(
      Receiver.abi,
      ReceiverAddress.Avalanche
    );
    const result = await contract.methods.s_oilPrice().call();
    if (result) {
      return parseFloat(formatUnits(result, 8));
    }
    return 0;
  }

  private static initWS() {
    this._WS_PROVIDER = new providers.WebSocketProvider(
      `wss://avalanche-fuji.infura.io/ws/v3/${process.env.INFURA_API_KEY}`,
      ChainID.Avalanche
    );
  }

  private static listenEvents() {
    console.log("listening for avalanche price update");
    const messageReceiverContract = new Contract(
      ReceiverAddress.Avalanche,
      Receiver.abi,
      this._WS_PROVIDER
    );

    messageReceiverContract.on(
      "MessageReceived",
      (latestMessageId, latestSourceChainSelector, latestSender, oilPrice) => {
        this._PRICE = parseFloat(formatUnits(oilPrice._hex, 8));
      }
    );
  }
}
