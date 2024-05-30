import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useState } from "react";

import { Collateral, CollateralComponent, ConnectButton } from "@/components";
import { Chain, ChainInfo, DepositToken, Token } from "@/constants";
import { useApproveAndMint } from "@/hooks/useApproveAndMint";
import { useShowToast } from "@/hooks/useShowToast";
import { Loader, SwapIcon } from "@/icons";
import { isValidChain, roundTo } from "@/lib/utils";
import { useBalances, usePrices } from "@/provider";
import { Button } from "@/ui/button";
import { LoanToValue } from "./LoanToValue";
import { SoilComponent } from "./SoilComponent";

const DEFAULT_COLLATERAL: Collateral = {
  token: Token.WETH,
  amount: 0,
};

export const BorrowModal = () => {
  const [deposit, setDeposit] = useState<Collateral>(DEFAULT_COLLATERAL);
  const [soilAmount, setSoilAmount] = useState<number>(0);
  const [loanToValue, _setLoanToValue] = useState<number>(0);
  const [borrowing, setBorrowing] = useState<boolean>(false);
  const { prices } = usePrices();
  const { getBalances, refreshBalances } = useBalances();
  const { approvalAndMint } = useApproveAndMint();
  const { isConnected, chainId } = useWeb3ModalAccount();
  const { showSuccessToast, showFailToast } = useShowToast();

  const disabled =
    loanToValue > 0.8 ||
    deposit.amount <= 0 ||
    soilAmount <= 0 ||
    borrowing ||
    deposit.amount > getBalances(deposit.token);

  const currentChain =
    (chainId && isValidChain(chainId) && ChainInfo[chainId].name) ||
    Chain.OPTIMISM;
  const setLoanToValue = async (depositAmount: number, soilAmount: number) => {
    const depositValue = prices[deposit.token] * depositAmount;
    const soilValue = prices.SOIL[currentChain] * soilAmount;
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
      prices.SOIL[currentChain];
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
    <div className="flex h-fit w-full flex-col justify-between rounded-lg bg-black-dim px-3 py-6 sm:p-8 md:gap-8">
      <h1 className="mb-3 text-xl font-semibold">Borrow SOIL</h1>
      <div className="flex w-full items-center justify-between max-md:flex-col md:gap-6">
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
        <div className="flex aspect-square w-fit items-center justify-center rounded-full bg-black p-1">
          <SwapIcon className="h-5 w-5 fill-gray-400 transition-all md:rotate-90" />
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
              <Loader className="h-6 w-7 fill-white stroke-white" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
