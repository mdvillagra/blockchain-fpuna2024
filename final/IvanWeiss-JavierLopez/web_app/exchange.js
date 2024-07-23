// =================== CS251 RAF Project =================== // 
//        @authors: Simon Tao '22, Mathew Hogan '22          //
// ========================================================= //                  

// Set up Ethers.js
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
var defaultAccount;

const exchange_name = 'RAF';             // TODO: fill in the name of your exchange

const token_name = 'ivachain';                // TODO: replace with name of your token
const token_symbol = 'IVA';              // TODO: replace with symbol for your token


// =============================================================================
//                          ABIs: Paste Your ABIs Here
// =============================================================================

const token_address = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const token_abi = [{
  "inputs": [],
  "stateMutability": "nonpayable",
  "type": "constructor"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "address",
      "name": "owner",
      "type": "address"
    },
    {
      "indexed": true,
      "internalType": "address",
      "name": "spender",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    }
  ],
  "name": "Approval",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "address",
      "name": "previousOwner",
      "type": "address"
    },
    {
      "indexed": true,
      "internalType": "address",
      "name": "newOwner",
      "type": "address"
    }
  ],
  "name": "OwnershipTransferred",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "address",
      "name": "from",
      "type": "address"
    },
    {
      "indexed": true,
      "internalType": "address",
      "name": "to",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    }
  ],
  "name": "Transfer",
  "type": "event"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "owner",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "spender",
      "type": "address"
    }
  ],
  "name": "allowance",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "spender",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }
  ],
  "name": "approve",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  "name": "balanceOf",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "callmint",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "decimals",
  "outputs": [
    {
      "internalType": "uint8",
      "name": "",
      "type": "uint8"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "spender",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "subtractedValue",
      "type": "uint256"
    }
  ],
  "name": "decreaseAllowance",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "disable_mint",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "spender",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "addedValue",
      "type": "uint256"
    }
  ],
  "name": "increaseAllowance",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }
  ],
  "name": "mint",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "name",
  "outputs": [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "owner",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "renounceOwnership",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "symbol",
  "outputs": [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "totalSupply",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "to",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }
  ],
  "name": "transfer",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "from",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "to",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }
  ],
  "name": "transferFrom",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "newOwner",
      "type": "address"
    }
  ],
  "name": "transferOwnership",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}];
const token_contract = new ethers.Contract(token_address, token_abi, provider.getSigner());
const exchange_abi = [{
  "inputs": [],
  "stateMutability": "nonpayable",
  "type": "constructor"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "address",
      "name": "previousOwner",
      "type": "address"
    },
    {
      "indexed": true,
      "internalType": "address",
      "name": "newOwner",
      "type": "address"
    }
  ],
  "name": "OwnershipTransferred",
  "type": "event"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "max_exchange_rate",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "min_exchange_rate",
      "type": "uint256"
    }
  ],
  "name": "addLiquidity",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "amountTokens",
      "type": "uint256"
    }
  ],
  "name": "createPool",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function"
},
{
  "inputs": [],
  "name": "getSwapFee",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "owner",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "max_exchange_rate",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "min_exchange_rate",
      "type": "uint256"
    }
  ],
  "name": "removeAllLiquidity",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "amountETHs",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "max_exchange_rate",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "min_exchange_rate",
      "type": "uint256"
    }
  ],
  "name": "removeLiquidity",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function"
},
{
  "inputs": [],
  "name": "renounceOwnership",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "reward",
  "outputs": [
    {
      "internalType": "contract Reward",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "max_exchange_rate",
      "type": "uint256"
    }
  ],
  "name": "swapETHForTokens",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "amountTokens",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "max_exchange_rate",
      "type": "uint256"
    }
  ],
  "name": "swapTokensForETH",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function"
},
{
  "inputs": [],
  "name": "token",
  "outputs": [
    {
      "internalType": "contract Token",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "newOwner",
      "type": "address"
    }
  ],
  "name": "transferOwnership",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}];
const exchange_address = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const exchange_contract = new ethers.Contract(exchange_address, exchange_abi, provider.getSigner());

// =============================================================================
//                              Provided Functions
// =============================================================================
// Reading and understanding these should help you implement the above

/*** INIT ***/
async function init() {
  var poolState = await getPoolState();
  console.log("starting init");
  if (poolState['token_liquidity'] === 0
    && poolState['eth_liquidity'] === 0) {

    const total_supply = 100000;
    await token_contract.connect(provider.getSigner(defaultAccount)).mint(total_supply / 2);
    await token_contract.connect(provider.getSigner(defaultAccount)).mint(total_supply / 2);
    //await token_contract.connect(provider.getSigner(defaultAccount)).disable_mint();
    await token_contract.connect(provider.getSigner(defaultAccount)).approve(exchange_address, total_supply);
    await token_contract.connect(provider.getSigner(defaultAccount)).approve(defaultAccount,total_supply);
   
    await exchange_contract.connect(provider.getSigner(defaultAccount)).createPool(5000, { value: ethers.utils.parseUnits("5000", "wei") });
    console.log("init finished");


    // All accounts start with 0 of your tokens. Thus, be sure to swap before adding liquidity.
  }
}

async function getPoolState() {
  // read pool balance for each type of liquidity:
  let liquidity_tokens = await token_contract.connect(provider.getSigner(defaultAccount)).balanceOf(exchange_address);
  let liquidity_eth = await provider.getBalance(exchange_address);
  return {
    token_liquidity: Number(liquidity_tokens),
    eth_liquidity: Number(liquidity_eth),
    token_eth_rate: Number(liquidity_tokens) / Number(liquidity_eth),
    eth_token_rate: Number(liquidity_eth) / Number(liquidity_tokens)
  };
}

// ============================================================
//                    FUNCTIONS TO IMPLEMENT
// ============================================================

// Note: maxSlippagePct will be passed in as an int out of 100. 
// Be sure to divide by 100 for your calculations.

/*** ADD LIQUIDITY ***/
async function addLiquidity(amountEth, maxSlippagePct) {

  var state = getPoolState();
  const exchange_rate = (await state).eth_token_rate;
  const max_exchange = exchange_rate * (1 + maxSlippagePct / 100);
  const min_exchange = exchange_rate * (1 - maxSlippagePct / 100);
  await exchange_contract.connect(provider.getSigner(defaultAccount)).addLiquidity(Math.ceil(max_exchange), Math.floor(min_exchange), { value: amountEth });
}

/*** REMOVE LIQUIDITY ***/
async function removeLiquidity(amountEth, maxSlippagePct) {
  var state = getPoolState();
  const exchange_rate = (await state).eth_token_rate;
  const max_exchange = exchange_rate * (1 + maxSlippagePct / 100);
  const min_exchange = exchange_rate * (1 - maxSlippagePct / 100);
  await exchange_contract.connect(provider.getSigner(defaultAccount)).removeLiquidity(amountEth, Math.ceil(max_exchange), Math.floor(min_exchange));
}

async function removeAllLiquidity(maxSlippagePct) {

  var state = getPoolState();
  const exchange_rate = (await state).eth_token_rate;
  const max_exchange = exchange_rate * (1 + maxSlippagePct / 100);
  const min_exchange = exchange_rate * (1 - maxSlippagePct / 100);
  await exchange_contract.connect(provider.getSigner(defaultAccount)).removeAllLiquidity(Math.ceil(max_exchange), Math.floor(min_exchange));
}

/*** SWAP ***/
async function swapTokensForETH(amountToken, maxSlippagePct) {

  var state = getPoolState();
  const exchange_rate = (await state).token_eth_rate;
  const max_exchange = exchange_rate * (1 + maxSlippagePct / 100);
  await exchange_contract.connect(provider.getSigner(defaultAccount)).swapTokensForETH(amountToken, Math.ceil(max_exchange));
}

async function swapETHForTokens(amountEth, maxSlippagePct) {

  var state = getPoolState();
  const exchange_rate = (await state).eth_token_rate;
  let max_exchange = exchange_rate*(1 + maxSlippagePct/100);
  await exchange_contract.connect(provider.getSigner(defaultAccount)).swapETHForTokens( Math.ceil(max_exchange),{ value: amountEth } );
}

// =============================================================================
//                                      UI
// =============================================================================


// This sets the default account on load and displays the total owed to that
// account.
provider.listAccounts().then((response) => {
  defaultAccount = response[0];
  // Initialize the exchange
  init().then(() => {
    // fill in UI with current exchange rate:
    getPoolState().then((poolState) => {
      $("#eth-token-rate-display").html("1 ETH = " + poolState['token_eth_rate'] + " " + token_symbol);
      $("#token-eth-rate-display").html("1 " + token_symbol + " = " + poolState['eth_token_rate'] + " ETH");

      $("#token-reserves").html(poolState['token_liquidity'] + " " + token_symbol);
      $("#eth-reserves").html(poolState['eth_liquidity'] + " ETH");
    });
  });
});

// Allows switching between accounts in 'My Account'
provider.listAccounts().then((response) => {
  var opts = response.map(function (a) {
    return '<option value="' +
      a.toLowerCase() + '">' + a.toLowerCase() + '</option>'
  });
  $(".account").html(opts);
});

// This runs the 'swapETHForTokens' function when you click the button
$("#swap-eth").click(function () {
  defaultAccount = $("#myaccount").val(); //sets the default account
  swapETHForTokens($("#amt-to-swap").val(), $("#max-slippage-swap").val()).then((response) => {
    window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
  })
});

// This runs the 'swapTokensForETH' function when you click the button
$("#swap-token").click(function () {
  defaultAccount = $("#myaccount").val(); //sets the default account
  swapTokensForETH($("#amt-to-swap").val(), $("#max-slippage-swap").val()).then((response) => {
    window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
  })
});

// This runs the 'addLiquidity' function when you click the button
$("#add-liquidity").click(function () {
  console.log("Account: ", $("#myaccount").val());
  defaultAccount = $("#myaccount").val(); //sets the default account
  addLiquidity($("#amt-eth").val(), $("#max-slippage-liquid").val()).then((response) => {
    window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
  })
});

// This runs the 'removeLiquidity' function when you click the button
$("#remove-liquidity").click(function () {
  defaultAccount = $("#myaccount").val(); //sets the default account
  removeLiquidity($("#amt-eth").val(), $("#max-slippage-liquid").val()).then((response) => {
    window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
  })
});

// This runs the 'removeAllLiquidity' function when you click the button
$("#remove-all-liquidity").click(function () {
  defaultAccount = $("#myaccount").val(); //sets the default account
  removeAllLiquidity($("#max-slippage-liquid").val()).then((response) => {
    window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
  })
});

$("#swap-eth").html("Swap ETH for " + token_symbol);

$("#swap-token").html("Swap " + token_symbol + " for ETH");

$("#title").html(exchange_name);


// This is a log function, provided if you want to display things to the page instead of the JavaScript console
// Pass in a discription of what you're printing, and then the object to print
function log(description, obj) {
  $("#log").html($("#log").html() + description + ": " + JSON.stringify(obj, null, 2) + "\n\n");
}


// =============================================================================
//                                SANITY CHECK
// =============================================================================
function check(name, swap_rate, condition) {
  if (condition) {
    console.log(name + ": SUCCESS");
    return (swap_rate == 0 ? 6 : 10);
  } else {
    console.log(name + ": FAILED");
    return 0;
  }
}


const sanityCheck = async function (enableLogging = true) {
  const log = (message) => {
    if (enableLogging) {
      console.log(message);
    }
  };

  log("=== Starting Sanity Check ===");

  var accounts = await provider.listAccounts();
  var defaultAccount = accounts[0];
  var score = 0;

  // Fetch initial states and balances
  var start_state = await getPoolState();
  var start_tokens = await token_contract.connect(provider.getSigner(defaultAccount)).balanceOf(defaultAccount);
  var swap_fee = 0;

  // Helper function for checking conditions and updating score
  const check = (description, fee, condition, details) => {
    const status = condition ? "Passed" : "Failed";
    log(`\n=== ${description} === Status: ${status}`);
    log(`Details:\n${details}`);
    return condition ? 10 : 0;
  };

  // Variables for the tests
  const ethAmountToSwap = 100;
  const tokenAmountToSwap = 100;
  const ethAmountToAddLiquidity = 100;
  const ethAmountToRemoveLiquidity = 10;
  const ethAmountToRemoveAllLiquidity = 90;
  const iterationsForLPRewards = 20;
  const tolerance = 5;

  // No liquidity provider rewards implemented yet

  // Test ETH to Token Swap
  await swapETHForTokens(ethAmountToSwap, 1);
  var state1 = await getPoolState();
  var expected_tokens_received = ethAmountToSwap * start_state.token_eth_rate;
  var user_tokens1 = await token_contract.connect(provider.getSigner(defaultAccount)).balanceOf(defaultAccount);
  score += check(
    "Testing simple exchange of ETH to token", 
    swap_fee[0],
    Math.abs((start_state.token_liquidity - expected_tokens_received) - state1.token_liquidity) < tolerance &&
    (state1.eth_liquidity - start_state.eth_liquidity) === ethAmountToSwap &&
    Math.abs(Number(start_tokens) + expected_tokens_received - Number(user_tokens1)) < tolerance,
    `Expected tokens received: ${expected_tokens_received}\n` +
    `Actual tokens received: ${Number(user_tokens1) - Number(start_tokens)}\n` +
    `Expected ETH liquidity change: ${ethAmountToSwap}\n` +
    `Actual ETH liquidity change: ${state1.eth_liquidity - start_state.eth_liquidity}`
  );

  // Test Token to ETH Swap
  await swapTokensForETH(tokenAmountToSwap, 1);
  var state2 = await getPoolState();
  var expected_eth_received = tokenAmountToSwap * state1.eth_token_rate;
  var user_tokens2 = await token_contract.connect(provider.getSigner(defaultAccount)).balanceOf(defaultAccount);
  score += check(
    "Testing simple exchange of token to ETH", 
    swap_fee[0],
    state2.token_liquidity === (state1.token_liquidity + tokenAmountToSwap) &&
    Math.abs((state1.eth_liquidity - expected_eth_received) - state2.eth_liquidity) < tolerance &&
    Number(user_tokens2) === (Number(user_tokens1) - tokenAmountToSwap),
    `Expected ETH received: ${expected_eth_received}\n` +
    `Actual ETH received: ${state1.eth_liquidity - state2.eth_liquidity}\n` +
    `Expected token liquidity change: ${tokenAmountToSwap}\n` +
    `Actual token liquidity change: ${state2.token_liquidity - state1.token_liquidity}`
  );

  // Test Adding Liquidity
  await addLiquidity(ethAmountToAddLiquidity, 1);
  var expected_tokens_added = ethAmountToAddLiquidity * state2.token_eth_rate;
  var state3 = await getPoolState();
  var user_tokens3 = await token_contract.connect(provider.getSigner(defaultAccount)).balanceOf(defaultAccount);
  score += check(
    "Testing adding liquidity", 
    swap_fee[0],
    state3.eth_liquidity === (state2.eth_liquidity + ethAmountToAddLiquidity) &&
    Math.abs(state3.token_liquidity - (state2.token_liquidity + expected_tokens_added)) < tolerance &&
    Math.abs(Number(user_tokens3) - (Number(user_tokens2) - expected_tokens_added)) < tolerance,
    `Expected tokens added: ${expected_tokens_added}\n` +
    `Actual tokens added: ${Number(user_tokens2) - Number(user_tokens3)}\n` +
    `Expected ETH liquidity change: ${ethAmountToAddLiquidity}\n` +
    `Actual ETH liquidity change: ${state3.eth_liquidity - state2.eth_liquidity}`
  );

  // Test Removing Liquidity
  await removeLiquidity(ethAmountToRemoveLiquidity, 1);
  var expected_tokens_removed = ethAmountToRemoveLiquidity * state3.token_eth_rate;
  var state4 = await getPoolState();
  var user_tokens4 = await token_contract.connect(provider.getSigner(defaultAccount)).balanceOf(defaultAccount);
  score += check(
    "Testing removing liquidity", 
    swap_fee[0],
    state4.eth_liquidity === (state3.eth_liquidity - ethAmountToRemoveLiquidity) &&
    Math.abs(state4.token_liquidity - (state3.token_liquidity - expected_tokens_removed)) < tolerance &&
    Math.abs(Number(user_tokens4) - (Number(user_tokens3) + expected_tokens_removed)) < tolerance,
    `Expected tokens removed: ${expected_tokens_removed}\n` +
    `Actual tokens removed: ${Number(user_tokens4) - Number(user_tokens3)}\n` +
    `Expected ETH liquidity change: ${ethAmountToRemoveLiquidity}\n` +
    `Actual ETH liquidity change: ${state3.eth_liquidity - state4.eth_liquidity}`
  );

  // Test Removing All Liquidity
  await removeAllLiquidity(1);
  var expected_tokens_removed_all = ethAmountToRemoveAllLiquidity * state4.token_eth_rate;
  var state5 = await getPoolState();
  var user_tokens5 = await token_contract.connect(provider.getSigner(defaultAccount)).balanceOf(defaultAccount);
  score += check(
    "Testing removing all liquidity", 
    swap_fee[0],
    Math.abs(state5.eth_liquidity - (state4.eth_liquidity - ethAmountToRemoveAllLiquidity)) < tolerance &&
    Math.abs(state5.token_liquidity - (state4.token_liquidity - expected_tokens_removed_all)) < tolerance &&
    Math.abs(Number(user_tokens5) - (Number(user_tokens4) + expected_tokens_removed_all)) < tolerance,
    `Expected tokens removed: ${expected_tokens_removed_all}\n` +
    `Actual tokens removed: ${Number(user_tokens5) - Number(user_tokens4)}\n` +
    `Expected ETH liquidity change: ${ethAmountToRemoveAllLiquidity}\n` +
    `Actual ETH liquidity change: ${state4.eth_liquidity - state5.eth_liquidity}`
  );

  log("=== Final score: " + score + "/50 ===");
};

setTimeout(function () {
  sanityCheck(true);
}, 3000);