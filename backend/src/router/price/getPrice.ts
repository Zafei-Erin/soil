import { Request, Response } from "express";
import {
  AvalanchePriceProvider,
  OptimismPriceProvider,
  PolygonPriceProvider,
} from "../../priceProvider";

export const getPrice = (req: Request, res: Response) => {
  res.status(200).json({
    weth: OptimismPriceProvider.price.WETH,
    dai: OptimismPriceProvider.price.DAI,
    soil: {
      optimism: OptimismPriceProvider.price.SOIL,
      polygon: PolygonPriceProvider.price,
      avalanche: AvalanchePriceProvider.price,
    },
  });
};
