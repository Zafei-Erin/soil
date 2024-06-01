import { UpdateSoilPriceComponent } from "@/components";
import { BorrowModal } from "./BorrowModal";

export const Borrow = () => {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-36 sm:min-w-[30rem]">
      <div className="flex h-60 flex-col items-center justify-center space-y-6">
        <div className="text-center text-5xl font-semibold">
          Synthetic Crude Oil Token
        </div>
        <div className="text-center text-2xl text-gray-400">
          Seamless Access to Global Commodities
        </div>
        {/* <div className="flex items-center justify-center gap-3 w-full">
          <MintTokenButton token="WETH" />
          <MintTokenButton token="DAI" />
        </div> */}
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-3">
        <BorrowModal />

        <UpdateSoilPriceComponent />
      </div>
    </div>
  );
};
