import SoilSource from "@/abis/SoilSource.json";
import { Selector } from "@/constants/Selector";
import { ChainID } from "@/constants/chainId";
import { TokenAddress } from "@/constants/token";
import { isValidChain } from "@/lib/utils";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, JsonRpcSigner, formatUnits } from "ethers";

export function useUpdateSOILPrice() {
  const { isConnected, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  let ethersProvider: BrowserProvider;
  let signer: JsonRpcSigner;
  let contract: Contract;

  const getEstimatedFee = async (selector: Selector) => {
    if (!isConnected || !walletProvider) {
      throw Error("User disconnected");
    }

    if (!chainId || !isValidChain(chainId) || chainId !== ChainID.Optimism) {
      throw Error("Chain not support");
    }
    ethersProvider = new BrowserProvider(walletProvider);
    signer = await ethersProvider.getSigner();

    const soilAddress = TokenAddress[chainId].SOIL;
    contract = new Contract(soilAddress, SoilSource.abi, signer);
    const result = await contract.getEstimatedFeeAmount(selector);
    const fee = parseFloat(formatUnits(result));
    return fee;
  };

  const updatePrice = async (selector: Selector, gas: bigint) => {
    if (!isConnected || !walletProvider) {
      throw Error("User disconnected");
    }

    if (!chainId || !isValidChain(chainId) || chainId !== ChainID.Optimism) {
      throw Error("Chain not support");
    }
    ethersProvider = new BrowserProvider(walletProvider);
    signer = await ethersProvider.getSigner();

    const soilAddress = TokenAddress[chainId].SOIL;
    contract = new Contract(soilAddress, SoilSource.abi, signer);
    await contract.updateCrudeOilPriceOnDestinationChain(selector, {
      value: gas,
    });
  };

  return { getEstimatedFee, updatePrice };
}
