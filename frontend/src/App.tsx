import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Borrow } from "./routes/borrow";
import { Dashboard } from "./routes/dashboard";
import { createWeb3Modal } from "@web3modal/ethers/react";
import { walletOptions } from "./config/walletConfig";
import { Toaster } from "./components/ui/toaster";
import { Liquidate } from "./routes/liquidate";

function App() {
  // Create a Web3Modal instance
  createWeb3Modal(walletOptions);
  return (
    <div>
      <Header />
      <div>
        <Routes>
          <Route path="/" element={<Borrow />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/liquidate" element={<Liquidate />} />
          <Route path="/*" element={<Borrow />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
