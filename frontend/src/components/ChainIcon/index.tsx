import { Chain } from "@/constants/chain";
import { IconProps } from "@/icons";
import { AvalancheIcon } from "@/icons/AvalancheIcon";
import { OptimismIcon } from "@/icons/OptimismIcon";
import { PolygonIcon } from "@/icons/PolygonIcon";
import { cn } from "@/lib/utils";

const ICONS: Record<Chain, React.FC<IconProps>> = {
  [Chain.AVALANCHE]: AvalancheIcon,
  [Chain.OPTIMISM]: OptimismIcon,
  [Chain.POLYGON]: PolygonIcon,
};

type Props = IconProps & {
  chain: Chain;
};

export const ChainIcon: React.FC<Props> = ({ chain, className, ...props }) => {
  const Icon = ICONS[chain];
  return <Icon className={cn("w-5 h-5", className)} {...props} />;
};
