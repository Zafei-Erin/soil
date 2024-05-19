import { useHealthFactor } from "@/hooks/useHealthFactor";
import { usePosition } from "@/hooks/usePosition";
import { RepayModal } from "./RepayModal";
import { WithdrawModal } from "./WithdrawModal";

export const Dashboard = () => {
  const { healthFactor } = useHealthFactor();
  const { position } = usePosition();
  return (
    <div className="flex flex-col gap-3 items-center justify-center bg-gray-100 h-screen pb-16">
      <div className="max-w-3xl w-full h-fit grid grid-cols-3 gap-8 max-md:items-center justify-between bg-white mx-4 p-8 rounded-lg border border-gray-200">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">Health Factor</h1>
          <div className="text-6xl text-gray-600 font-semibold">
            {healthFactor.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </div>
        </div>

        <div className="col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Collateral deposited</h3>
              <div>
                $
                {position.deposited.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
            <WithdrawModal />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Borrow</h3>
              <div>
                $
                {position.borrowed.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
            <RepayModal />
          </div>
        </div>
      </div>
    </div>
  );
};
