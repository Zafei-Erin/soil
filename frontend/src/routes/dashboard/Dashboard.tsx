import { ConnectButton } from "@/components/ConnectButton";
import { usePosition } from "@/hooks/usePosition";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { HealthFactor } from "./HealthFactor";
import { RepayModal } from "./RepayModal";
import { WithdrawModal } from "./WithdrawModal";

export const Dashboard = () => {
  const { position, refreshPosition } = usePosition();
  const { isConnected } = useWeb3ModalAccount();
  return (
    <div className="h-full py-16">
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-96 h-[30rem] bg-white rounded-lg border border-gray-200">
          {!isConnected && (
            <div className="backdrop-blur-md w-full h-full absolute bg-white/60 rounded-lg flex flex-col gap-6 items-center justify-center">
              <h1 className="text-2xl font-semibold">
                Please connect your wallet
              </h1>
              <ConnectButton />
            </div>
          )}

          <div className=" mx-4 p-8 ">
            <HealthFactor />

            <div className="space-y-3 mt-10">
              <h3 className="font-semibold">Collateral deposited</h3>
              <div>
                $
                {position.deposited.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </div>
              <WithdrawModal
                position={position}
                refreshPosition={refreshPosition}
                className="w-full"
              />
            </div>

            <div className="space-y-3 mt-10">
              <h3 className="font-semibold">Borrow</h3>
              <div>
                $
                {position.borrowed.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </div>
              <RepayModal
                position={position}
                refreshPosition={refreshPosition}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
