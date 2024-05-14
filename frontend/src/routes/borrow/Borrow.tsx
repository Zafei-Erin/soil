import MintWethButton from "@/components/MintWethButton";
import { BorrowModal } from "./BorrowModal";
import { InformativeModal } from "./InformativeModal";

export const Borrow = () => {
  return (
    <div className="bg-gray-100 h-full pb-16">
      <div className="space-y-6 h-60 flex flex-col items-center justify-center">
        <div className="text-5xl font-semibold text-center">Slogan1</div>
        <div className="text-2xl font-semibold text-center text-gray-600">
          Slogan2
        </div>
        <MintWethButton />
      </div>
      <div className="flex flex-col gap-3 items-center justify-center">
        <BorrowModal />
        <InformativeModal />
      </div>
    </div>
  );
};
