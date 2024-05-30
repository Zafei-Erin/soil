import { ComponentProps, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type Props = Omit<
  ComponentProps<"input">,
  "ref" | "type" | "inputMode" | "value" | "autoComplete" | "onChange"
> & {
  amount?: number;
  onAmountChange?: (amount: number) => void;
};

export const ControlledNumberInput: React.FC<Props> = ({
  amount,
  onAmountChange,
  className,
  ...props
}) => {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    setValue(amount == undefined ? "" : amount == 0 ? "" : amount.toString());
  }, [amount]);
  return (
    <input
      {...props}
      className={cn(
        "bg-transparent appearance-none focus:outline-none block w-full text-lg",
        className
      )}
      type="text"
      inputMode="decimal"
      value={value}
      autoComplete="off"
      onChange={(e) => {
        if (e.target.value == "") {
          setValue("");
          onAmountChange?.(0);
          return;
        }
        const n = Number(e.target.value);
        if (!isNaN(n)) {
          setValue(e.target.value);
          onAmountChange?.(n);
        }
      }}
    />
  );
};
