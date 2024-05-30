import { cn } from "@/lib/utils";
import { Slider } from "@/ui/slider";

type Props = {
  loanToValue: number;
  changeHF: (value: number[]) => void;
};

export const LoanToValue: React.FC<Props> = ({ loanToValue, changeHF }) => {
  const isError = loanToValue > 0.8;
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-satoshi">LoanToValue %</h3>
        <span
          className={cn(
            "font-satoshi",
            isError ? "text-red-600" : "text-green-bright"
          )}
        >
          {loanToValue == 0 ? "" : (loanToValue * 100).toFixed(2)}%
        </span>
      </div>
      <Slider
        defaultValue={[0]}
        value={[loanToValue]}
        max={1}
        min={0}
        step={0.01}
        onValueChange={changeHF}
        isError={isError}
      />
      <div className="sm:mt-2 h-4">
        {isError && (
          <span className="text-xs text-red-600">
            LoanToValue must be less than 80%
          </span>
        )}
      </div>
    </div>
  );
};
