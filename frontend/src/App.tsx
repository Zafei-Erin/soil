import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Borrow } from "./routes/borrow";
import { Dashboard } from "./routes/dashboard";
import { createWeb3Modal } from "@web3modal/ethers/react";
import { walletOptions } from "./config/walletConfig";
import { Toaster } from "./components/ui/toaster";
import { Liquidate } from "./routes/liquidate";
import { PriceProvider } from "./provider/priceProvider/PriceProvider";

function App() {
  // Create a Web3Modal instance
  createWeb3Modal(walletOptions);
  return (
    <div>
      <Header />

      <PriceProvider>
        <div className="h-[calc(100dvh-5rem)] w-full">
          <Routes>
            <Route path="/" element={<Borrow />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/liquidate" element={<Liquidate />} />
            <Route path="/*" element={<Borrow />} />
          </Routes>
        </div>
      </PriceProvider>
      <Toaster />
    </div>
  );
}

export default App;
