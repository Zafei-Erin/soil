import { Link, useLocation } from "react-router-dom";
import { ConnectButton } from "./ConnectButton";
import { cn } from "@/lib/utils";

export const Header = () => {
  const { pathname } = useLocation();
  return (
    <div className="h-20 flex items-center justify-center sm:justify-end sm:pr-32 py-3">
      <div className="flex gap-3 items-center text-gray-400">
        <Link to="/">
          <span className={cn(pathname == "/" && "text-white")}>
            Mint / Borrow
          </span>
        </Link>
        <Link to="/dashboard">
          <span className={cn(pathname == "/dashboard" && "text-white")}>
            DashBoard
          </span>
        </Link>
        <Link to="/liquidate">
          <span className={cn(pathname == "/liquidate" && "text-white")}>
            Liquidate
          </span>
        </Link>
        <ConnectButton />
      </div>
    </div>
  );
};
