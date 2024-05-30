import { Request, Response } from "express";
import {
  AvalanchePriceProvider,
  OptimismPriceProvider,
  PolygonPriceProvider,
} from "../../priceProvider";

export const getPrice = (req: Request, res: Response) => {
  res.status(200).json({
    WETH: OptimismPriceProvider.price.WETH,
    DAI: OptimismPriceProvider.price.DAI,
    SOIL: {
      Optimism: OptimismPriceProvider.price.SOIL,
      Polygon: PolygonPriceProvider.price,
      Avalanche: AvalanchePriceProvider.price,
    },
  });
};
