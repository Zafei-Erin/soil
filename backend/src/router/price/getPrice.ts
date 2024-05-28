import { Request, Response } from "express";
import { providers, Contract } from "ethers";
import SoilDestination from "../../abis/SoilDestination.json";
import { TokenAddress } from "../../constants";
import WebSocket from "ws";
import dotenv from "dotenv";

export const getPrice = async (req: Request, res: Response) => {
  dotenv.config();
  let provider = new providers.WebSocketProvider(
    `wss://polygon-amoy.infura.io/ws/v3/${process.env.INFURA_WS}`,
    80002
  );
  const contract = new Contract(
    "0x0cCe7D1668C3A72E8d5F6f3bDF7Bc6606f03D262",
    SoilDestination.abi,
    provider
  );

  contract.on(
    "MessageReceived",
    (latestMessageId, latestSourceChainSelector, latestSender, oilPrice) => {
      console.log(oilPrice);
    }
  );
};
