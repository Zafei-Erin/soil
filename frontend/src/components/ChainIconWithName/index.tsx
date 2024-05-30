import { ComponentProps } from "react";

import { ChainIcon } from "@/components";
import { Chain } from "@/constants";
import { cn } from "@/lib/utils";

type Props = ComponentProps<"div"> & {
  chain: Chain;
  iconClass?: string;
};

export const ChainIconWithName: React.FC<Props> = ({
  chain,
  iconClass,
  className,
  ...props
}) => {
  return (
    <div
      className={cn("flex items-center justify-center gap-1.5", className)}
      {...props}
    >
      <ChainIcon chain={chain} className={iconClass} />
      <span>{chain}</span>
    </div>
  );
};
