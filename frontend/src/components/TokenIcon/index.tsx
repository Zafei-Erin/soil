import { Token } from "@/constants";
import { DaiIcon, IconProps, SoilIcon, WethIcon } from "@/icons";
import { cn } from "@/lib/utils";

const ICONS: Record<Token, React.FC<IconProps>> = {
  [Token.DAI]: DaiIcon,
  [Token.WETH]: WethIcon,
  [Token.SOIL]: SoilIcon,
};

type Props = IconProps & {
  token: Token;
};

export const TokenIcon: React.FC<Props> = ({ token, className, ...props }) => {
  const Icon = ICONS[token];
  return <Icon className={cn("w-5 h-5", className)} {...props} />;
};
