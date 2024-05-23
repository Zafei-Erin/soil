import MintWethButton from "@/components/MintWethButton";
import { BorrowModal } from "./BorrowModal";
import { UpdateSoilPriceModal } from "@/components/UpdateSoilPriceModal";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { isValidChain } from "@/lib/utils";
import { ChainID } from "@/constants/chainId";

export const Borrow = () => {
  const { chainId } = useWeb3ModalAccount();
  return (
    <div className="pb-36">
      <div className="space-y-6 h-60 flex flex-col items-center justify-center">
        <div className="text-5xl font-semibold text-center">Slogan1</div>
        <div className="text-2xl font-semibold text-center text-gray-600">
          Slogan2
        </div>
        <MintWethButton />
      </div>
      <div className="flex flex-col gap-3 items-center justify-center">
        <BorrowModal />
        {chainId && isValidChain(chainId) && chainId !== ChainID.Optimism && (
          <UpdateSoilPriceModal chainId={chainId}/>
        )}
      </div>
    </div>
  );
};
