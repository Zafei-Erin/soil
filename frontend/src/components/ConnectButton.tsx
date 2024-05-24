import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";
import { Wallet } from "lucide-react";
import { Button, ButtonProps } from "./ui/button";
import { cn } from "@/lib/utils";

type Props = Omit<ButtonProps, "onClick">;
export const ConnectButton: React.FC<Props> = ({ className, ...props }) => {
  const { open } = useWeb3Modal();
  const { isConnected, address } = useWeb3ModalAccount();
  return (
    <div>
      {isConnected ? (
        <Button
          onClick={() => open({ view: "Account" })}
          className={cn(
            "flex items-center justify-center gap-2 text-xs bg-zinc-700/40 text-gray-100 rounded-lg hover:bg-zinc-600/50",
            className
          )}
          {...props}
        >
          <Wallet className="h-4 w-4 stroke-emerald-500" />
          <span>
            {address?.slice(0, 4)}...{address?.slice(-4)}
          </span>
        </Button>
      ) : (
        <Button
          onClick={() => open({ view: "Connect" })}
          className={cn(
            "flex items-center justify-center gap-2 text-xs bg-zinc-700/40 text-gray-100 rounded-lg hover:bg-zinc-600/50",
            className
          )}
          {...props}
        >
          <Wallet className="h-4 w-4 stroke-zinc-500" />
          <span>Connect Wallet</span>
        </Button>
      )}
    </div>
  );
};
