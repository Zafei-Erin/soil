import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useState } from "react";

import { CollateralComponent } from "@/components/CollateralComponent";
import { ConnectButton } from "@/components/ConnectButton";
import { Button } from "@/components/ui/button";
import { useShowToast } from "@/components/useShowToast";
import { DepositToken } from "@/constants/token";
import { useApproveAndMint } from "@/hooks/useApproveAndMint";
import { Loader } from "@/icons";
import { SwapIcon } from "@/icons/SwapIcon";
import { roundTo } from "@/lib/utils";
import { useBalances } from "@/provider/balanceProvider";
import { usePrices } from "@/provider/priceProvider";
import { LoanToValue } from "./LoanToValue";
import { SoilComponent } from "./SoilComponent";

export type Deposit = {
  token: DepositToken;
  amount: number;
};

export const BorrowModal = () => {
  const [deposit, setDeposit] = useState<Deposit>({
    token: "WETH",
    amount: 0,
  });
  const [soilAmount, setSoilAmount] = useState<number>(0);
  const [loanToValue, _setLoanToValue] = useState<number>(0);
  const [borrowing, setBorrowing] = useState<boolean>(false);
  const { prices } = usePrices();
  const { getBalances, refreshBalances } = useBalances();
  const { approvalAndMint } = useApproveAndMint();
  const { isConnected } = useWeb3ModalAccount();
  const { showSuccessToast, showFailToast } = useShowToast();

  const disabled =
    loanToValue > 0.8 ||
    deposit.amount <= 0 ||
    soilAmount <= 0 ||
    borrowing ||
    deposit.amount > getBalances(deposit.token);

  const setLoanToValue = async (depositAmount: number, soilAmount: number) => {
    const depositValue = prices[deposit.token] * depositAmount;
    const soilValue = prices.SOIL_ON_CHAIN * soilAmount;
    let loanToValue = soilValue / depositValue;

    loanToValue =
      isNaN(loanToValue) || loanToValue == Infinity ? 0 : loanToValue;
    _setLoanToValue(loanToValue);
  };
  const changeDepositAmount = (amount: number) => {
    setDeposit((prev) => ({ ...prev, amount: amount }));
    setLoanToValue(amount, soilAmount);
  };
  const changeSoilAmount = (amount: number) => {
    setSoilAmount(amount);
    setLoanToValue(deposit.amount, amount);
  };
  const changeHF = (value: number[]) => {
    _setLoanToValue(value[0]);

    let s =
      (value[0] * deposit.amount * prices[deposit.token]) /
      prices.SOIL_ON_CHAIN;
    s = isNaN(s) ? 0 : s;
    s = roundTo(s, 2);
    setSoilAmount(s);
  };

  const borrow = async () => {
    if (loanToValue > 0.8 || deposit.amount <= 0 || soilAmount <= 0) {
      return;
    }
    setBorrowing(true);

    try {
      await approvalAndMint(deposit.token, deposit.amount, soilAmount);
      refreshBalances();
      showSuccessToast(`You have borrow ${soilAmount} SOIL!`);
    } catch (error) {
      console.log(error);
      showFailToast("Failed to borrow SOIL");
    } finally {
      setBorrowing(false);
    }
  };

  return (
    <div className="bg-black-dim w-full h-fit flex flex-col md:gap-8 justify-between px-3 py-6 sm:p-8 rounded-lg">
      <h1 className="text-xl font-semibold mb-3">Borrow SOIL</h1>
      <div className="flex max-md:flex-col items-center justify-between md:gap-6 w-full">
        <CollateralComponent
          onTokenChange={(token: DepositToken) => {
            setDeposit((prev) => ({
              ...prev,
              token: token,
            }));
            _setLoanToValue(0);
          }}
          onAmountChange={changeDepositAmount}
          deposit={deposit}
          isError={deposit.amount > getBalances(deposit.token)}
          errorMessage={"Exceeds your balance"}
        />
        <div className="rounded-full bg-black aspect-square w-fit p-1 flex items-center justify-center">
          <SwapIcon className="w-5 h-5 md:rotate-90 fill-gray-400 transition-all" />
        </div>
        <SoilComponent amount={soilAmount} onAmountChange={changeSoilAmount} />
      </div>

      <LoanToValue loanToValue={loanToValue} changeHF={changeHF} />
      <div className="mt-6 w-full">
        {!isConnected ? (
          <ConnectButton
            variant={"main"}
            className="w-full rounded-full text-black"
            iconClass="stroke-black"
          />
        ) : (
          <Button
            variant={"main"}
            className="w-full"
            onClick={borrow}
            disabled={disabled}
          >
            <span>Borrow</span>
            {borrowing && (
              <Loader className="w-7 h-6 stroke-white fill-white" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
