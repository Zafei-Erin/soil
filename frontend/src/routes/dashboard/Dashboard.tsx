import { usePosition } from "@/hooks/usePosition";
import { RepayModal } from "./RepayModal";
import { WithdrawModal } from "./WithdrawModal";
import { HealthFactor } from "./HealthFactor";

export const Dashboard = () => {
  const { position } = usePosition();
  return (
    <div className="flex flex-col gap-3 items-center justify-center h-full bg-gray-100 pb-16">
      <div className="max-w-sm w-full h-fit gap-8 max-md:items-center justify-between bg-white mx-4 p-8 rounded-lg border border-gray-200">
        <HealthFactor />

        <div className="space-y-3 mt-6">
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
