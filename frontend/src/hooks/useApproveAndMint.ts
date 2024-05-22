import SOIL from "@/abis/SOIL.json";
import ERC20 from "@/abis/ERC20.json";
import { DepositToken, TokenAddress } from "@/constants/token";
import { isValidChain } from "@/lib/utils";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, parseUnits } from "ethers";

export function useApproveAndMint() {
  const { isConnected, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const approvalAndMint = async (
    depositToken: DepositToken,
    depositAmount: number,
    soilAmount: number
  ) => {
    if (!isConnected || !walletProvider) {
      throw Error("User disconnected");
    }

    if (!chainId || !isValidChain(chainId)) {
      throw Error("Chain not support");
    }

    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();

    const SOILAddress = TokenAddress[chainId].SOIL;
    const SOILContract = new Contract(SOILAddress, SOIL.abi, signer);

    const ERC20Address = TokenAddress[chainId][depositToken];
    const ERC20Contract = new Contract(ERC20Address, ERC20.abi, signer);

    // approval
    try {
      const approvalTxn = await ERC20Contract.approve(
        SOILAddress,
        parseUnits(depositAmount.toString())
      );
      approvalTxn.wait();
    } catch (error) {
      throw new Error("approval error");
    }

    // depositAndMint
    try {
      const depositAndMintTxn = await SOILContract.depositAndMint(
        ERC20Address,
        parseUnits(depositAmount.toString()),
        parseUnits(soilAmount.toString())
      );
      depositAndMintTxn.wait();
    } catch (error) {
      throw new Error("mint error");
    }
  };

  return { approvalAndMint };
}
