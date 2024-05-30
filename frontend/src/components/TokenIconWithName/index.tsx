import { ComponentProps } from "react";

import { TokenIcon } from "@/components";
import { Token } from "@/constants";
import { cn } from "@/lib/utils";

type Props = ComponentProps<"div"> & {
  token: Token;
  iconClass?: string;
};

export const TokenIconWithName: React.FC<Props> = ({
  token,
  iconClass,
  className,
  ...props
}) => {
  return (
    <div
      className={cn("flex items-center justify-center gap-1.5", className)}
      {...props}
    >
      <div className="bg-white rounded-full p-1 border border-green-bright">
        <TokenIcon token={token} className={iconClass} />
      </div>
      <span>{token}</span>
    </div>
  );
};
