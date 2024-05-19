import MintWethButton from "@/components/MintWethButton";
import { BorrowModal } from "./BorrowModal";

export const Borrow = () => {
  return (
    <div>
      <div className="space-y-6 h-60 flex flex-col items-center justify-center">
        <div className="text-5xl font-semibold text-center">Slogan1</div>
        <div className="text-2xl font-semibold text-center text-gray-600">
          Slogan2
        </div>
        <MintWethButton />
      </div>
      <div className="flex flex-col gap-3 items-center justify-center">
        <BorrowModal />
      </div>
    </div>
  );
};
