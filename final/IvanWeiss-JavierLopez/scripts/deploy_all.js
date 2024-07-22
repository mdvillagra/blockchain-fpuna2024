const hre = require("hardhat");
const fs = require('fs');

// Function to deploy a contract and return its instance
async function deployContract(contractName) {
  const ContractFactory = await hre.ethers.getContractFactory(contractName);
  const contractInstance = await ContractFactory.deploy();
  await contractInstance.deployed();
  console.log(`${contractName} contract deployed at: ${contractInstance.address}`);
  return contractInstance;
}

// Function to get the full ABI of a contract
function getFullAbi(contractInstance) {
  return contractInstance.interface.format(hre.ethers.utils.FormatTypes.full);
}

// Function to update exchange.js with new contract addresses and ABIs
function updateExchangeJs(filePath, addressesAndAbis) {
  const fileContent = fs.readFileSync(filePath, 'utf8');

  let updatedContent = fileContent;

  Object.keys(addressesAndAbis).forEach(key => {
    const { address, abi } = addressesAndAbis[key];
    const addressRegex = new RegExp(`const ${key}_address = '.*?';`);
    const abiRegex = new RegExp(`const ${key}_abi = \\[.*?];`);

    updatedContent = updatedContent.replace(addressRegex, `const ${key}_address = '${address}';`);
    updatedContent = updatedContent.replace(abiRegex, `const ${key}_abi = ${JSON.stringify(abi)};`);
  });

  fs.writeFileSync(filePath, updatedContent);
  console.log(`Updated ${filePath} with new contract addresses and ABIs`);
}

function updateContractAddresses(filePath, updates) {
  let fileContent = fs.readFileSync(filePath, 'utf8');

  Object.keys(updates).forEach(key => {
    const regex = new RegExp(`(${key}\\s*=\\s*).*?;`, 'g');
    fileContent = fileContent.replace(regex, `$1${updates[key]};`);
  });

  fs.writeFileSync(filePath, fileContent);
  console.log(`Updated ${filePath} with new addresses`);
}


// Main function to deploy all contracts and update exchange.js
async function main() {
  // Deploy the Token contract
  const tokenContract = await deployContract('Token');
  const tokenAbi = getFullAbi(tokenContract);

  // Update contract addresses
  let updates = {
    'address tokenAddr': tokenContract.address,
  };

  updateContractAddresses('contracts/exchange.sol', updates);

  // Deploy the TokenExchange contract
  const tokenExchangeContract = await deployContract('TokenExchange');
  const exchangeAbi = getFullAbi(tokenExchangeContract);

  // Update exchange.js with the new addresses and ABIs
  const addressesAndAbis = {
    token: {
      address: tokenContract.address,
      abi: tokenAbi
    },
    exchange: {
      address: tokenExchangeContract.address,
      abi: exchangeAbi
    }
  };

  updateExchangeJs('web_app/exchange.js', addressesAndAbis);
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
