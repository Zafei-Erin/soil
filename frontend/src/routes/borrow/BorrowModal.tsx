import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract, parseUnits } from "ethers";
import { DepositComponent } from "@/components/DepositComponent";
import { Button } from "@/components/ui/button";
import { cn, roundTo } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useFetchPrice } from "@/hooks/useFetchPrice";
import { Slider } from "@/components/ui/slider";
import SOIL from "@/abis/SOIL.json";
import ERC20 from "@/abis/ERC20.json";
import { DepositToken, tokenAddress } from "@/types/address";
import { useFetchBalances } from "@/hooks/useFetchBalance";

type Deposit = {
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
  const { prices } = useFetchPrice();
  const { balances, refreshBalances } = useFetchBalances();
  const { isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const disabled =
    loanToValue > 0.8 ||
    deposit.amount <= 0 ||
    soilAmount <= 0 ||
    borrowing ||
    deposit.amount > balances[deposit.token];

  const setLoanToValue = async (depositAmount: number, soilAmount: number) => {
    const depositValue = prices[deposit.token] * depositAmount;
    const soilValue = prices["SOIL"] * soilAmount;
    let loanToValue = soilValue / depositValue;

    loanToValue =
      isNaN(loanToValue) || loanToValue == Infinity ? 0 : loanToValue;
    _setLoanToValue(loanToValue);
  };
  const changeDepositAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    let t = parseFloat(e.target.value);
    t = isNaN(t) ? 0 : t;
    setDeposit((prev) => ({ ...prev, amount: t }));
    setLoanToValue(t, soilAmount);
  };
  const changeSoilAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    let s = parseFloat(e.target.value);
    s = isNaN(s) ? 0 : s;
    setSoilAmount(s);
    setLoanToValue(deposit.amount, s);
  };
  const changeHF = (value: number[]) => {
    _setLoanToValue(value[0]);

    let s =
      (value[0] * deposit.amount * prices[deposit.token]) / prices["SOIL"];
    s = isNaN(s) ? 0 : s;
    s = roundTo(s, 2);
    setSoilAmount(s);
  };

  const approvalAndMint = async () => {
    if (!isConnected || !walletProvider) throw Error("User disconnected");

    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();

    const SOILContract = new Contract(tokenAddress["SOIL"], SOIL.abi, signer);
    const ERC20Contract = new Contract(
      tokenAddress[deposit.token],
      ERC20.abi,
      signer
    );

    try {
      // approval
      const approvalTxn = await ERC20Contract.approve(
        tokenAddress["SOIL"],
        parseUnits(deposit.amount.toString())
      );
      approvalTxn.wait();
    } catch (error) {
      throw new Error("approval error");
    }

    try {
      // depositAndMint
      const depositAndMintTxn = await SOILContract.depositAndMint(
        tokenAddress[deposit.token],
        parseUnits(deposit.amount.toString()),
        parseUnits(soilAmount.toString())
      );
      depositAndMintTxn.wait();
    } catch (error) {
      throw new Error("mint error");
    }
  };

  const borrow = async () => {
    if (loanToValue > 0.8 || deposit.amount <= 0 || soilAmount <= 0) {
      return;
    }
    setBorrowing(true);

    try {
      await approvalAndMint();
      refreshBalances();
      toast({
        duration: 1500,
        title: "Borrow Successfully",
        description: `You have borrow ${soilAmount} SOIL!`,
        action: (
          <ToastAction altText="View in dashboard">
            <Link to="dashboard" className="text-xs">
              View in dashboard
            </Link>
          </ToastAction>
        ),
      });
    } catch (error) {
      console.log(error);
      toast({
        duration: 1500,
        title: "Borrow Failed",
        description: `${error}`,
      });
    } finally {
      setBorrowing(false);
    }
  };

  return (
    <div className="max-w-3xl h-fit flex flex-col gap-8 max-md:items-center justify-between bg-white mx-4 p-8 rounded-lg border border-gray-200">
      <h1 className="text-2xl font-semibold">Borrow SOIL</h1>

      <div className="md:flex max-md:space-y-6 justify-between md:gap-3">
        {/* deposit */}
        <div className="space-y-3">
          <h3 className="font-semibold">Deposit required</h3>

          <DepositComponent
            status="deposit"
            onTokenChange={(token: DepositToken) => {
                setDeposit((prev) => ({
                  ...prev,
                  token: token,
                }));
                _setLoanToValue(0);
              }}
            onAmountChange={changeDepositAmount}
            deposit={deposit}
            errorMessage={
              deposit.amount > balances[deposit.token]
                ? "You dont have enough balance!"
                : ""
            }
          />
        </div>

        {/* borrow */}
        <div className="space-y-3">
          <h3 className="font-semibold">Borrow</h3>
          <div className="flex gap-2">
            <div className="bg-gray-100 flex items-center justify-center px-4 w-32 rounded-lg h-12 border border-gray-200">
              SOIL
            </div>
            <div className="bg-gray-100 h-12 w-30 rounded-lg border border-gray-200 px-4 py-1">
              <input
                value={soilAmount == 0 ? "" : soilAmount}
                inputMode="decimal"
                onChange={changeSoilAmount}
                className="bg-transparent  appearance-none focus:outline-none"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600">
                  price: $
                  {prices["SOIL"].toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-gray-600">
                  balance: {balances["SOIL"]}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Health Factor */}
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold">LoanToValue %</h3>
        <div>
          <input
            value={loanToValue == 0 ? "" : (loanToValue * 100).toFixed(2)}
            disabled
            className="bg-gray-100 h-12 w-30 rounded-lg border border-gray-200 px-4 appearance-none focus:outline-none"
          />
          <p
            className={cn(
              "text-xs text-red-600 mt-2 hidden",
              loanToValue > 0.8 && "block"
            )}
          >
            LoanToValue must be less than 80% to place a transaction
          </p>
        </div>
        <Slider
          defaultValue={[0]}
          value={[loanToValue]}
          max={1}
          min={0}
          step={0.01}
          onValueChange={changeHF}
        />
      </div>
      <Button className="w-full mt-3" onClick={borrow} disabled={disabled}>
        Borrow
      </Button>
    </div>
  );
};
