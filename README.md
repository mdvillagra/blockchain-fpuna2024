# Decentralized Cryptocurrency Exchange
This project involves creating a decentralized cryptocurrency exchange using Solidity and JavaScript. The exchange will mimic the functionality of popular DEXs like Uniswap and allow users to trade a custom ERC20 token. Additionally, the project includes developing a web client to interact with the smart contracts.

## Getting Started
### Setup
1. Install Node.js: Download and install an appropriate version from the Node.js previous releases.
2. Clone the repository:
```bash
git clone https://github.com/Sef-99/blockchain-fpuna2024.git
```
3. Navigate to the Directory:
```bash
cd blockchain-fpuna2024/final/enrique-sanchez-cesar-rodas/
```
### Install Dependencies:
```bash
npm install --save-dev hardhat
```
```bash
npm install --save-dev @nomiclabs/hardhat-ethers ethers
```
```bash
npm install --save-dev @openzeppelin/contracts
```
## Compile, Deploy, and Test
### Modify Contracts and Backend:
1. Start Local Ethereum Node:
```bash
npx hardhat node
```
2. Deploy Token Contract:
```bash
npx hardhat run --network localhost scripts/deploy_token.js
```
3. Deploy Exchange Contract:
```bash
npx hardhat run --network localhost scripts/deploy_exchange.js
```
4. Update Web Client: Update the contract addresses and ABI in web_app/exchange.js.
5. Run the Web Client: Open web_app/index.html in your browser (preferably Chrome).
