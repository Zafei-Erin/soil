import { MintTokenButton } from "@/components/MintTokenButton";
import { UpdateSoilPriceModal } from "@/components/UpdateSoilPriceModal";
import { BorrowModal } from "./BorrowModal";

export const Borrow = () => {
  return (
    <div className="pb-36 max-w-3xl sm:min-w-[30rem] mx-auto px-6">
      <div className="space-y-6 h-60 flex flex-col items-center justify-center">
        <div className="text-5xl font-semibold text-center">Slogan1</div>
        <div className="text-2xl font-semibold text-center text-gray-600">
          Slogan2
        </div>
        <div className="flex items-center justify-center gap-3 w-full">
          <MintTokenButton token="WETH" />
          <MintTokenButton token="DAI" />
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full items-center justify-center">
        <BorrowModal />

        <UpdateSoilPriceModal />
      </div>
    </div>
  );
};
