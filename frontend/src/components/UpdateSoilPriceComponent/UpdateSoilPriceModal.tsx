import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Selector } from "@/constants/Selector";
import { DestinationChain } from "@/constants/chain";
import { ChainID } from "@/constants/chainId";
import { useUpdatePrice } from "@/hooks/useGetEstimatedPrice";
import { Loader } from "@/icons";
import { cn, isValidChain } from "@/lib/utils";
import { DialogTriggerProps } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useShowToast } from "../useShowToast";
import { ChainTab } from "./ChainTab";
import { DEFAULT_CHAIN_TO_UPDATE } from "./config";

type Props = DialogTriggerProps;

export const UpdateSoilPriceModal: React.FC<Props> = ({
  className,
  ...props
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [chainToUpdate, setChainToUpdate] = useState<DestinationChain>(
    DEFAULT_CHAIN_TO_UPDATE
  );
  const [fee, setFee] = useState<number>(0);
  const { open: openWallet } = useWeb3Modal();
  const { chainId } = useWeb3ModalAccount();
  const { showSuccessToast, showFailToast } = useShowToast();
  const { getEstimatedFee } = useUpdatePrice();

  const shouldSwitchNetwork =
    !chainId || !isValidChain(chainId) || chainId !== ChainID.Optimism;

  useEffect(() => {
    // Should Switch Network to Optimism
    if (shouldSwitchNetwork) {
      setCurrentStep(1);
    } else {
      setCurrentStep(2);
    }
  }, [shouldSwitchNetwork]);

  const getEstimatedFeeWrapped = async () => {
    setLoading(true);
    try {
      const fee = await getEstimatedFee(Selector[ChainID[chainToUpdate]]);
      setFee(fee);
      setCurrentStep(3);
    } catch (error) {
      console.log(error);
      showFailToast("Failed to get estimated fee!");
    } finally {
      setLoading(false);
    }
  };

  const updatePrice = async () => {
    setLoading(true);
    try {
      if (!chainId || !isValidChain(chainId) || chainId !== ChainID.Optimism) {
        throw new Error();
      }
      showSuccessToast("Update SOIL Price Successfully");
      setOpen(false);
    } catch (error) {
      console.log(error);
      showFailToast("Failed to Update SOIL Price");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild {...props}>
        <Button
          variant={"main"}
          className={cn(
            "w-full md:w-fit rounded-full flex items-center justify-center gap-2 disabled:cursor-not-allowed",
            className
          )}
        >
          Update Price
          {loading && <Loader className="w-7 h-6 stroke-white fill-white" />}
        </Button>
      </DialogTrigger>

      <DialogContent
        className="border-0 bg-black-dim sm:w-96 font-satoshi"
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Update SOIL Price</DialogTitle>
        </DialogHeader>

        <div className="w-full flex flex-col gap-6 p-2">
          <div className="grid grid-cols-3 items-center gap-x-6">
            <span className="col-span-2">1. Switch to Optimism chain</span>
            <Button
              disabled={currentStep != 1}
              onClick={() => openWallet({ view: "Networks" })}
              variant={"secondary"}
              className="w-full"
            >
              <span>Switch</span>
              {loading && currentStep == 1 && (
                <Loader className="w-7 h-6 stroke-white fill-white" />
              )}
            </Button>
          </div>

          <div className="grid grid-cols-3 items-center gap-x-6 content-between">
            <div className="col-span-2 space-y-2">
              <span>2. Get Estimated Fee</span>
              <div className="pl-5 w-full">
                <div className="flex items-center gap-2 w-full">
                  <span>Chain:</span>
                  <div className="flex-1">
                    <ChainTab
                      setChainToUpdate={setChainToUpdate}
                      mode="small"
                      className="w-4/5"
                    />
                  </div>
                </div>
                <div className="mt-2 space-x-2">
                  <span>Fee:</span>
                  <span>
                    {fee.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>
            <Button
              disabled={currentStep != 2}
              onClick={getEstimatedFeeWrapped}
              variant={"secondary"}
              className=""
            >
              <span>Action</span>
              {loading && currentStep == 2 && (
                <Loader className="w-7 h-6 stroke-white fill-white" />
              )}
            </Button>
          </div>

          <div className="grid grid-cols-3 items-center gap-x-6">
            <span className=" col-span-2">3. Update Price</span>
            <Button
              disabled={currentStep != 3}
              onClick={updatePrice}
              variant={"secondary"}
              className="w-full"
            >
              <span>Update</span>
              {loading && currentStep == 3 && (
                <Loader className="w-7 h-6 stroke-white fill-white" />
              )}
            </Button>
          </div>
        </div>
        <DialogFooter className="mx-auto w-full"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
