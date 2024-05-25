import { Token } from "@/constants/token";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { TokenIcon } from "../TokenIcon";

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
      <div>{token}</div>
    </div>
  );
};
