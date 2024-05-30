import { ComponentProps, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Props = Omit<
  ComponentProps<"input">,
  "inputMode" | "type" | "ref" | "onBeforeInput" | "onChange"
> & {
  onAmountChange?: (amount: number) => void;
};

const VALID_FLOAT_REGEX = /^\d*\.?\d*$/;

export const NumberInput: React.FC<Props> = ({
  onAmountChange,
  className,
  ...props
}) => {
  const [value, setValue] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <input
      {...props}
      ref={inputRef}
      type="text"
      inputMode="decimal"
      className={cn(
        "bg-transparent appearance-none focus:outline-none",
        className
      )}
      onBeforeInput={(e: React.CompositionEvent<HTMLInputElement>) => {
        // Only allow valid numbers
        if (VALID_FLOAT_REGEX.test(inputRef.current?.value + e.data)) {
          return;
        }
        // Otherwise, prevent the input
        e.preventDefault();
      }}
      onChange={(e) => {
        const num = Number(e.target.value);
        if (num == value || isNaN(num)) {
          return;
        }
        setValue(num);
        onAmountChange?.(num);
      }}
    />
  );
};
