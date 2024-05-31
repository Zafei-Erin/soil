# Synthetic Crude Oil Token

<br/>
<p align="center">
<img src="./sOil-icon.webp" width="400" alt="sOil-icon">
</p>
<br/>

Tokenized Crude Oil smart contract provides broader access to trading and investment opportunities. It enables fractional trading of crude oil assets, reducing barriers and bypassing bureaucratic restrictions, allowing for more efficient and inclusive participation.

## About

- **Collateral**: WETH / DAI
- **Stability Mechanism**: Algorithmic
- **Using**: Chainlink price feeds, Chainlink CCIP
- **Available at**: Optimism Sepolia, Avalanche Fuji, Polygon Amoy

Synthetic Crude Oil Token (sOIL) is not backed by a real-world commodity but rather by other cryptocurrencies, specifically WETH and DAI. DAI was chosen over other stablecoins because of its decentralized nature.

To mint sOIL, users deposit either WETH or DAI. To maintain price stability, sOIL requires 150% over-collateralization. For instance, to mint $100 worth of sOIL, a user must lock $150 worth of WETH or DAI. If the collateral or underlying asset prices fluctuate, causing the collateralization rate to drop below 150%, the position can be liquidated by other users who receive a 10% bonus in the underlying asset.

### Liquidation mechanism

The liquidation mechanism ensures that the asset's value closely aligns with its underlying collateral. This is a common practice for stablecoins to keep their value pegged, usually around $1. When a stablecoin is backed by real dollars, the amount in the bank should match the number of tokens minted.

In our case, we aim for the synthetic crude oil token (sOIL) to mirror the value of real crude oil. To achieve this, users must maintain collateral assets exceeding the value of the sOIL they have minted. Due to the volatility of the underlying assets, a 1:1 collateral-to-token ratio would likely result in frequent liquidations. Therefore, over-collateralization is required.

If the health factor of a position drops below a specific threshold—for instance, if the collateral value falls below 150% of the sOIL value (a 1:1.5 ratio)—other users can liquidate that position. In the liquidation process, the minted sOIL is burned, and the liquidator receives the underlying collateral at a 10% discount as a reward. This discount incentivizes liquidators to maintain the system's stability.

### Cross-chain data transfer

Since the WTI Crude Oil price is available only on Optimism Sepolia via Chainlink PriceFeeds, Chainlink CCIP is used to access this price on other networks. To update the price on a destination chain, users must call an update function on the source chain (Optimism). 
The system is designed to be self-regulating, and we believe users will actively update the price on networks where it is not directly available for the following reasons:

- Incentive for Liquidators: If the Crude Oil price increases or collateral asset price decreases, liquidators are incentivized to update the price to liquidate under-collateralized positions and receive a 10% bonus.
- Incentive for Users: Conversely, if the Crude Oil price decreases or collateral asset price increases, users are motivated to update the price to improve their health factor, avoid liquidation, and free up extra collateral assets.

## Usage

### Requirements

- git `git --version`
- foundry `forge --version`

### Installation

Clone repo

```bash
git clone git@github.com:allelementary/synthetic-crude-oil.git
```

Install requirements with make

```bash
make
```

### Run Tests

```bash
make test
```

### Deploy Source (OP Sepolia) and Destination (Avalanche Fuji, Polygon Amoy) contracts

1. Add parameters to .env:
   - PRIVATE_KEY
   - OPTIMISM_SCAN_API_KEY
   - OP_SEPOLIA_RPC_URL
   - FUJI_RPC_URL
   - AMOY_RPC_URL

2. First Deploy sOIL on destination chains:

```bash
make deploy_oil ARGS='--network fuji'

make deploy_oil ARGS='--network amoy'
```

It would deploy CCIP `Receiver.sol` and `sOilDestination` contracts for each chain

3. Update `script/HelperConfig.sol` receiver contract addresses:

```diff
    function getDestinationChainConfig() public pure returns (DestinationChainConfig memory config) {
        config = DestinationChainConfig({
            avalancheFujiChainSelector: 14767482510784806043,
            polygonAmoyChainSelector: 16281711391670634445,
-           avalancheFujiReceiver: 0xd6a80097825cB7957bD8bdA9676f8aDae35265BC,
-           polygonAmoyReceiver: 0x98243Ace02e8bF668f7a565b5bc6E79BF584a768
+           avalancheFujiReceiver: <deployed receiver address>,
+           polygonAmoyReceiver: <deployed receiver address>
        });
    }
```

4. Deploy sOIL on source chain:

```bash
make deploy_oil ARGS='--network op_sepolia'
```

### sOIL Contract Addresses

- Optimism Sepolia: 0x929072C633F56E61391cB183EFbb5f1dA86Dc56a
- Avalanche Fuji: 0x9774c3ed1dEC3F0829290E0616e2BFb1Cc26A75D
- Polygon Amoy: 0x0cCe7D1668C3A72E8d5F6f3bDF7Bc6606f03D262

### Custom token addresses

For the project custom ERC-20 tokens are used to represent WETH and DAI

**Optimism Sepolia**
- WETH: 0x387FD5E4Ea72cF66f8eA453Ed648e64908f64104
- DAI: 0xaf9B15aA0557cff606a0616d9B76B94887423022

**Avalanche Fuji**
- WETH: 0x9991D14b93CD58fE8dD1A5a901608f18664225Ff
- DAI: 0xC49E3c2b119026500cC442DA8D7c34316a1D3cF1

**Polygon Amoy**
- WETH: 0x387FD5E4Ea72cF66f8eA453Ed648e64908f64104
- DAI: 0xaf9B15aA0557cff606a0616d9B76B94887423022



### Mint WETH and DAI tokens

To mint tokens for testing execute following command:

```bash
cast send <token-address> "mint(address,uint256)" <wallet-address> <amount-in-wei> --private-key <private_key> --rpc-url <rpc_url>
```
