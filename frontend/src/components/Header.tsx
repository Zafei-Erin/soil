import { Link } from "react-router-dom";
import ConnectButton from "./ConnectButton";

export const Header = () => {
  return (
    <div className="h-20 flex items-center justify-between px-6 py-3">
      <div>Logo</div>
      <div className="flex gap-3 items-center">
        <Link to="/">Mint and Borrow</Link>
        <Link to="/dashboard">DashBoard</Link>
        <ConnectButton />
      </div>
    </div>
  );
};
