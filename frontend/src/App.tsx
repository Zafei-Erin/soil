import { createWeb3Modal } from "@web3modal/ethers/react";
import { Route, Routes } from "react-router-dom";

import { Header } from "./components";
import { walletOptions } from "./config/walletConfig";
import {
  BalanceProvider,
  HealthFactorProvider,
  PriceProvider,
} from "./provider";
import { Borrow } from "./routes/borrow";
import { Dashboard } from "./routes/dashboard";
import { Liquidate } from "./routes/liquidate";
import { Toaster } from "./ui/toast/toaster";

function App() {
  // Create a Web3Modal instance
  createWeb3Modal(walletOptions);
  return (
    <div className="relative min-h-screen w-full">
      <div className="absolute z-10 h-0 w-0 translate-x-[24rem] translate-y-[6rem] rounded-full shadow-[0_0_140px_140px_rgba(16,185,129,0.3)]" />
      <div className="absolute z-10 h-0 w-0 translate-x-[80rem] translate-y-[20rem] rounded-full shadow-[0_0_150px_150px_rgba(16,185,129,0.3)] " />
      <div className="absolute z-10 h-0 w-0 translate-x-[50rem] translate-y-[42rem] rounded-full shadow-[0_0_130px_130px_rgba(16,185,129,0.3)]" />
      <Header />

      <PriceProvider>
        <BalanceProvider>
          <HealthFactorProvider>
            <div className="h-[calc(100dvh-5rem)] w-full">
              <Routes>
                <Route path="/" element={<Borrow />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/liquidate" element={<Liquidate />} />
                <Route path="/*" element={<Borrow />} />
              </Routes>
            </div>
          </HealthFactorProvider>
        </BalanceProvider>
      </PriceProvider>
      <Toaster />
    </div>
  );
}

export default App;
