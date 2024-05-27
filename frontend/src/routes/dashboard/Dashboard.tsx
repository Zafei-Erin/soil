import { ConnectButton } from "@/components/ConnectButton";
import { usePosition } from "@/hooks/usePosition";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { HealthFactor } from "./HealthFactor";
import { RepayModal } from "./RepayModal";
import { WithdrawModal } from "./WithdrawModal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const { position, refreshPosition } = usePosition();
  const { isConnected } = useWeb3ModalAccount();
  return (
    <div className="pt-16 px-6 flex items-center justify-center">
      <div className="relative w-96 min-h-[30rem] bg-black-dim rounded-lg font-satoshi">
        {!isConnected && (
          <div className="backdrop-blur-md w-full h-full absolute bg-green-bright/5 rounded-lg flex flex-col gap-16 items-center justify-center">
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

        <div className="py-8 px-6">
          <HealthFactor />

          <hr className="h-0.5 mt-7 mb-5 bg-gradient-to-r from-gray-400" />

          {/* Collateral deposited */}
          <div className="space-y-2 flex items-center justify-between">
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
          <div className="space-y-2 mt-10 flex items-center justify-between">
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
