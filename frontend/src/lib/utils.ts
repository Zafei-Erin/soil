import { ChainID } from "@/constants/chainId";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function roundTo(num: number, precision: number) {
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
}

export const isValidChain = (chainId: number): chainId is ChainID => {
  return Object.values(ChainID).includes(chainId as ChainID);
};
