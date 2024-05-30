import { Router } from "express";
import { getPrice } from "./price";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "API is working" });
});

router.get("/price", getPrice);

export default router;
