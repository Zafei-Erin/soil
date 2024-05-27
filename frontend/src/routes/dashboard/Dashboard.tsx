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
      <div className="relative w-96 min-h-[32rem] bg-black-dim rounded-lg font-satoshi">
        {!isConnected && (
          <div className="backdrop-blur-md w-full h-full absolute bg-green-bright/5 rounded-lg flex flex-col gap-6 items-center justify-center">
            <h1 className="text-2xl font-semibold">
              Please connect your wallet
            </h1>
            <ConnectButton
              className="w-full rounded-full bg-gradient-to-r from-green-bright to-green-bright/60 text-black transition-all hover:bg-green-bright/90"
              iconClass="stroke-black"
            />
          </div>
        )}

        <div className="py-8 px-6">
          <HealthFactor />

          <hr className="h-0.5 mt-6 mb-10 bg-gradient-to-r from-gray-400" />

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
              className="w-fit min-w-20 bg-green-bright text-black rounded-full hover:bg-green-bright/90"
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
              className="w-fit min-w-20 rounded-full bg-green-bright text-black hover:bg-green-bright/90"
            />
          </div>

          {/* Home Button */}
          <Button className="mt-16 w-full rounded-full bg-gradient-to-r from-green-bright/80 transition-all to-green-bright/60 hover:from-green-bright/40 hover:to-green-bright/60">
            <Link to={"/"}>Borrow / Update SOIL Price</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
