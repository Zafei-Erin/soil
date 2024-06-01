import { cn } from "@/lib/utils";
import { Slider } from "@/ui/slider";

type Props = {
  loanToValue: number;
  changeHF: (value: number) => void;
  threshold: number;
};

export const LoanToValue: React.FC<Props> = ({
  loanToValue,
  changeHF,
  threshold,
}) => {
  const isError = loanToValue > threshold;
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
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
        onValueChange={(value) => {
          changeHF(value[0]);
        }}
        isError={isError}
      />
      <div className="h-4 sm:mt-2">
        {isError && (
          <span className="text-xs text-red-600">
            {`LoanToValue must be less than ${threshold.toLocaleString(undefined, { style: "percent" })}`}
          </span>
        )}
      </div>
    </div>
  );
};
