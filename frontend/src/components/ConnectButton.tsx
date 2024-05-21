import { cn } from "@/lib/utils";
import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";
import { Button, ButtonProps } from "./ui/button";

type Props = Omit<ButtonProps, "onClick">;
export const ConnectButton: React.FC<Props> = ({ className, ...props }) => {
  const { open } = useWeb3Modal();
  const { isConnected } = useWeb3ModalAccount();
  return (
    <div>
      {isConnected ? (
        <w3m-account-button balance="hide" />
      ) : (
        <Button
          onClick={() => open({ view: "Connect" })}
          className={cn("", className)}
          {...props}
        >
          connect wallet
        </Button>
      )}
    </div>
  );
};
