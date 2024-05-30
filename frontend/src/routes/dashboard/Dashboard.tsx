import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { Link } from "react-router-dom";

import { ConnectButton } from "@/components";
import { usePosition } from "@/hooks/usePosition";
import { Button } from "@/ui/button";
import { HealthFactor } from "./HealthFactor";
import { RepayModal } from "./RepayModal";
import { WithdrawModal } from "./WithdrawModal";

export const Dashboard = () => {
  const { position, refreshPosition } = usePosition();
  const { isConnected } = useWeb3ModalAccount();
  return (
    <div className="flex items-center justify-center px-6 pt-16">
      <div className="relative min-h-[30rem] w-96 rounded-lg bg-black-dim font-satoshi">
        {!isConnected && (
          <div className="absolute z-50 flex h-full w-full flex-col items-center justify-center gap-16 rounded-lg bg-green-bright/5 backdrop-blur-md">
            <h1 className="text-2xl font-semibold">
              Please connect your wallet
            </h1>
            <ConnectButton
              variant={"main"}
              className="w-full rounded-full text-black"
              iconClass="stroke-black"
            />
          </div>
        )}

        <div className="px-6 py-8">
          <HealthFactor />

          <hr className="mb-5 mt-7 h-0.5 bg-gradient-to-r from-gray-400" />

          {/* Collateral deposited */}
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h3 className="text-gray-400">Collateral deposited</h3>
              <div>
                $
                {position.deposited.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
            <WithdrawModal
              position={position}
              refreshPosition={refreshPosition}
              className="w-fit min-w-20"
            />
          </div>

          {/* Borrowed */}
          <div className="mt-10 flex items-center justify-between space-y-2">
            <div>
              <h3 className="text-gray-400">Borrowed</h3>
              <div>
                $
                {position.borrowed.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
            <RepayModal
              position={position}
              refreshPosition={refreshPosition}
              className="w-fit min-w-20"
            />
          </div>

          {/* Home Button */}
          <Button variant={"main"} className="mt-12 w-full rounded-full">
            <Link to={"/"}>Borrow / Update SOIL Price</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
