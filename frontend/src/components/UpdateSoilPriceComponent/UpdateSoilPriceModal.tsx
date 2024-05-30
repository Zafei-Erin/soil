import { DialogTriggerProps } from "@radix-ui/react-dialog";
import {
  useSwitchNetwork,
  useWeb3Modal,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { parseUnits } from "ethers";
import { useEffect, useState } from "react";

import { ChainID, ChainInfo, DestinationChain, Selector } from "@/constants";
import { useShowToast } from "@/hooks/useShowToast";
import { useUpdateSOILPrice } from "@/hooks/useUpdateSOILPrice";
import { Loader } from "@/icons";
import { cn, isValidChain } from "@/lib/utils";
import { Button } from "@/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { ChainTab } from "./ChainTab";
import { DEFAULT_CHAIN_TO_UPDATE } from "./default";

type Props = DialogTriggerProps;

export const UpdateSoilPriceModal: React.FC<Props> = ({
  className,
  ...props
}) => {
  const [fee, setFee] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [chainToUpdate, setChainToUpdate] = useState<DestinationChain>(
    DEFAULT_CHAIN_TO_UPDATE
  );

  const { open: openWallet } = useWeb3Modal();
  const { switchNetwork } = useSwitchNetwork();
  const { isConnected, chainId } = useWeb3ModalAccount();
  const { showSuccessToast, showFailToast } = useShowToast();
  const { getEstimatedFee, updatePrice } = useUpdateSOILPrice();

  const shouldSwitchNetwork =
    !chainId || !isValidChain(chainId) || chainId !== ChainID.Optimism;

  useEffect(() => {
    // Should Switch Network to Optimism
    if (shouldSwitchNetwork) {
      setCurrentStep(1);
    } else {
      setCurrentStep(2);
    }
  }, [shouldSwitchNetwork, open]);

  useEffect(() => {
    setFee(0);
    setChainToUpdate(DEFAULT_CHAIN_TO_UPDATE);
  }, [open]);

  const getEstimatedFeeWrapped = async () => {
    setLoading(true);
    try {
      const fee = await getEstimatedFee(Selector[ChainID[chainToUpdate]]);
      setFee(fee);
      setCurrentStep(3);
    } catch (error) {
      // console.log(error);
      showFailToast("Failed to get estimated fee!");
    } finally {
      setLoading(false);
    }
  };

  const updatePriceWrapped = async () => {
    setLoading(true);
    try {
      if (!chainId || !isValidChain(chainId) || chainId !== ChainID.Optimism) {
        throw new Error();
      }
      await updatePrice(
        Selector[ChainID[chainToUpdate]],
        parseUnits(fee.toString())
      );
      showSuccessToast("Price will be update in a while.");
      setOpen(false);
    } catch (error) {
      // console.log(error);
      showFailToast("Failed to Update SOIL Price");
    } finally {
      setLoading(false);
    }
  };

  const onChainChange = (chain: DestinationChain) => {
    setChainToUpdate(chain);
    if (currentStep >= 2) {
      setCurrentStep(2);
    }
    setFee(0);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild {...props}>
        <Button
          variant={"main"}
          className={cn(
            "w-full rounded-full disabled:cursor-not-allowed md:w-fit",
            className
          )}
        >
          Update Price
        </Button>
      </DialogTrigger>

      <DialogContent
        className="border-0 bg-black-dim font-satoshi sm:w-96"
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Update SOIL Price</DialogTitle>
        </DialogHeader>

        <div className="flex w-full flex-col gap-6 p-2">
          <div className="grid grid-cols-3 items-center gap-x-6">
            <span className="col-span-2">1. Switch to Optimism chain</span>
            <Button
              disabled={currentStep != 1}
              onClick={() => {
                if (!isConnected) {
                  openWallet({ view: "Connect" });
                } else {
                  switchNetwork(ChainID.Optimism);
                }
              }}
              variant={"secondary"}
              className="w-fit min-w-24 space-x-2 justify-self-end"
            >
              <span>Switch</span>
              {loading && currentStep == 1 && (
                <Loader className="h-6 w-6 fill-white stroke-white" />
              )}
            </Button>
          </div>

          <div className="grid grid-cols-3 content-between items-center gap-x-6">
            <div className="col-span-2 space-y-2">
              <span>2. Get Estimated Fee</span>
              <div className="w-full pl-5">
                <div className="flex w-full items-center gap-2">
                  <span>Chain:</span>
                  <div className="flex-1">
                    <ChainTab
                      setChainToUpdate={onChainChange}
                      mode="small"
                      className="w-4/5"
                    />
                  </div>
                </div>
                <div className="mt-2 space-x-2">
                  <span>Fee:</span>
                  <span className="text-xs">
                    {fee !== 0 &&
                      `${fee.toFixed(8)} ${
                        ChainInfo[ChainID[chainToUpdate]].token
                      }`}
                  </span>
                </div>
              </div>
            </div>
            <Button
              disabled={currentStep != 2}
              onClick={getEstimatedFeeWrapped}
              variant={"secondary"}
              className="w-fit min-w-24 space-x-2 justify-self-end"
            >
              <span>Action</span>
              {loading && currentStep == 2 && (
                <Loader className="h-6 w-6 fill-white stroke-white" />
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 items-center gap-x-6">
            <span className=" col-span-1">3. Update Price</span>
            <Button
              disabled={currentStep != 3}
              onClick={updatePriceWrapped}
              variant={"secondary"}
              className="w-fit min-w-24 space-x-2 justify-self-end"
            >
              <span>Update</span>
              {loading && currentStep == 3 && (
                <Loader className="h-6 w-6 fill-white stroke-white" />
              )}
            </Button>
          </div>
        </div>
        <DialogFooter className="mx-auto w-full"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
