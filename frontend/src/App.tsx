import { createWeb3Modal } from "@web3modal/ethers/react";
import { Route, Routes } from "react-router-dom";

import { Header } from "./components/Header";
import { Toaster } from "./components/ui/toaster";
import { walletOptions } from "./config/walletConfig";
import { BalanceProvider } from "./provider/balanceProvider";
import { HealthFactorProvider } from "./provider/healthFactorProvider";
import { PriceProvider } from "./provider/priceProvider/PriceProvider";
import { Borrow } from "./routes/borrow";
import { Dashboard } from "./routes/dashboard";
import { Liquidate } from "./routes/liquidate";

function App() {
  // Create a Web3Modal instance
  createWeb3Modal(walletOptions);
  return (
    <div className="relative w-full min-h-screen">
      <div className="absolute rounded-full h-0 w-0 translate-x-[24rem] translate-y-[6rem] shadow-[0_0_140px_140px_rgba(16,185,129,0.3)]" />
      <div className="absolute rounded-full h-0 w-0 translate-x-[80rem] translate-y-[20rem] shadow-[0_0_150px_150px_rgba(16,185,129,0.3)] " />
      <div className="absolute rounded-full h-0 w-0 translate-x-[50rem] translate-y-[42rem] shadow-[0_0_130px_130px_rgba(16,185,129,0.3)]" />
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
