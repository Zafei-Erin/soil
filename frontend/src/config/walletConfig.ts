import { defaultConfig, Web3ModalOptions } from "@web3modal/ethers/react";

// 1. Get projectId
const projectId = import.meta.env.VITE_CONNECT_WALLET_PROJECTID;

// 2. Set chains
const Amoy = {
  chainId: 80002,
  name: "Polygon Amoy Testnet",
  currency: "MATIC",
  explorerUrl: "https://amoy.polygonscan.com/",
  rpcUrl: "https://rpc-amoy.polygon.technology/",
};
const Polygon = {
  chainId: 137,
  name: "Polygon Mainnet",
  currency: "MATIC",
  explorerUrl: "https://polygonscan.com",
  rpcUrl: "https://polygon-rpc.com",
};
const Avalanche = {
  chainId: 43114,
  name: "Avalanche Network",
  currency: "AVAX",
  explorerUrl: "https://snowtrace.io/",
  rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
};

// 3. Create a metadata object
const metadata = {
  name: "My Website",
  description: "My Website description",
  url: "https://mywebsite.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: "...", // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
});

export const walletOptions: Web3ModalOptions = {
  ethersConfig,
  chains: [Amoy, Polygon, Avalanche],
  projectId,
  featuredWalletIds: [
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // metamaske
    "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // trust wallet
    "8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4", // binance
  ],
  includeWalletIds: [
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // metamaske
    "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // trust wallet
    "8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4", // binance
  ],
  allWallets: "ONLY_MOBILE",
  connectorImages: {
    walletConnect: "https://walletconnect.com/static/favicon.png", //wallet connect
  },
};
