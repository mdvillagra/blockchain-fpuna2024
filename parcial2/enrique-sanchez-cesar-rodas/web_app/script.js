// =============================================================================
//                                  Config
// =============================================================================
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
var defaultAccount;

// Constant we use later
var GENESIS =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

// This is the ABI for your contract (get it from Remix, in the 'Compile' tab)
// ============================================================
var abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "debtor",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creditor",
        type: "address",
      },
    ],
    name: "DebtRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "debtor",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creditor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newAmount",
        type: "uint256",
      },
    ],
    name: "DebtUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "debtor",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creditor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "IOUAdded",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "creditor",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "addIOU",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "debts",
    outputs: [
      {
        internalType: "address",
        name: "creditor",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllUsers",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "debtor",
        type: "address",
      },
    ],
    name: "getCreditors",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getTotalOwed",
    outputs: [
      {
        internalType: "uint256",
        name: "totalOwed",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "debtor",
        type: "address",
      },
      {
        internalType: "address",
        name: "creditor",
        type: "address",
      },
    ],
    name: "lookup",
    outputs: [
      {
        internalType: "uint256",
        name: "ret",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "debtor",
        type: "address",
      },
      {
        internalType: "address",
        name: "creditor",
        type: "address",
      },
    ],
    name: "removeDebt",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "debtor",
        type: "address",
      },
      {
        internalType: "address",
        name: "creditor",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "newAmount",
        type: "uint256",
      },
    ],
    name: "updateDebt",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userExists",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "users",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]; // FIXME: fill this in with your contract's ABI //Be sure to only have one array, not two
// ============================================================
abiDecoder.addABI(abi);
// call abiDecoder.decodeMethod to use this - see 'getAllFunctionCalls' for more

var contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // FIXME: fill this in with your contract's address/hash

var BlockchainSplitwise = new ethers.Contract(
  contractAddress,
  abi,
  provider.getSigner()
);

// =============================================================================
//                            Functions To Implement
// =============================================================================

// TODO: Add any helper functions here!

// TODO: Return a list of all users (creditors or debtors) in the system
// All users in the system are everyone who has ever sent or received an IOU
async function getUsers() {
  const users = await BlockchainSplitwise.getAllUsers();
  return users;
}

// TODO: Get the total amount owed by the user specified by 'user'
async function getTotalOwed(user) {
  const totalOwed = await BlockchainSplitwise.getTotalOwed(user);
  return totalOwed;
}

// TODO: Get the last time this user has sent or received an IOU, in seconds since Jan. 1, 1970
// Return null if you can't find any activity for the user.
// HINT: Try looking at the way 'getAllFunctionCalls' is written. You can modify it if you'd like.
async function getLastActive(user) {
  const addressOfContract = BlockchainSplitwise.address;
  const functionName = "addIOU";

  const allFunctionCalls = await getAllFunctionCalls(
    addressOfContract,
    functionName
  );

  let latestTimestamp = null;

  allFunctionCalls.forEach((call) => {
    if (
      call.args[0].toLowerCase() === user.toLowerCase() ||
      call.from.toLowerCase() === user.toLowerCase()
    ) {
      if (latestTimestamp === null || call.t > latestTimestamp) {
        latestTimestamp = call.t;
      }
    }
  });

  return latestTimestamp;
}

// TODO: add an IOU ('I owe you') to the system
// The person you owe money is passed as 'creditor'
// The amount you owe them is passed as 'amount'
async function add_IOU(creditor, amount) {
  const signer = provider.getSigner(defaultAccount);
  const contractWithSigner = BlockchainSplitwise.connect(signer);
  const transaction = await contractWithSigner.addIOU(creditor, amount);
  await transaction.wait();
  console.log("IOU added successfully");
  await resolveCircularDebts(defaultAccount, creditor, amount);
}

async function getNeighbors(startNode) {
  let neighbors = [];
  let users = await getCallsOfFunction();
  console.log(`Fetching neighbors for node: ${startNode}`);
  console.log(`Total users: ${users.length}`);

  for (let i = 0; i < users.length; i++) {
    let creditor = users[i];
    console.log(`Checking debt between ${startNode} and ${creditor}`);

    let debt = await BlockchainSplitwise.lookup(startNode, creditor);
    console.log(`Debt between ${startNode} and ${creditor}: ${debt}`);

    if (debt > 0) {
      neighbors.push(creditor);
      console.log(`${creditor} is a neighbor of ${startNode}`);
    }
  }

  console.log(`Neighbors of ${startNode}: ${neighbors}`);
  return neighbors;
}

async function resolveCircularDebts(debtor, creditor, amount) {
  // Find a cycle using BFS
  const cycle = await detectCycle(debtor, creditor);

  console.log(cycle);

  if (cycle) {
    // Find the minimum debt in the cycle
    let minDebt = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < cycle.length - 1; i++) {
      const debtor = cycle[i];
      const creditor = cycle[i + 1];
      const debt = await BlockchainSplitwise.lookup(debtor, creditor);
      if (debt < minDebt) {
        minDebt = debt;
      }
    }

    // Subtract the minimum debt from each edge in the cycle
    for (let i = 0; i < cycle.length - 1; i++) {
      const debtor = cycle[i];
      const creditor = cycle[i + 1];
      const debt = await BlockchainSplitwise.lookup(debtor, creditor);

      if (debt === minDebt) {
        // Remove the debt if it becomes zero
        await removeDebt(debtor, creditor);
      } else {
        // Update the debt with the new amount
        await updateDebt(debtor, creditor, debt - minDebt);
      }
    }
  }
}

async function detectCycle(startNode) {
  let queue = [[startNode]];
  let visited = new Set();
  let parent = {};

  while (queue.length > 0) {
    let path = queue.shift();
    let currentNode = path[path.length - 1];

    console.log(`Current path: ${path}`);
    console.log(`Current node: ${currentNode}`);

    if (!visited.has(currentNode)) {
      visited.add(currentNode);
      console.log(`Visited nodes: ${Array.from(visited)}`);

      let neighbors = await getNeighbors(currentNode);
      console.log(`Neighbors of ${currentNode}: ${neighbors}`);

      for (let neighbor of neighbors) {
        if (neighbor === startNode) {
          path.push(startNode);
          console.log(`Cycle found: ${path}`);
          return path;
        }

        if (!visited.has(neighbor)) {
          parent[neighbor] = currentNode;
          let newPath = path.concat([neighbor]);
          queue.push(newPath);
          console.log(`Pushing path to queue: ${newPath}`);
        }
      }
    }
    console.log("---");
  }

  console.log("No cycle found");
  return null;
}

async function removeDebt(debtor, creditor) {
  const signer = provider.getSigner(defaultAccount);
  const contractWithSigner = BlockchainSplitwise.connect(signer);
  const transaction = await contractWithSigner.removeDebt(debtor, creditor);
  await transaction.wait();
}

async function updateDebt(debtor, creditor, newAmount) {
  const signer = provider.getSigner(defaultAccount);
  console.log("entering updateDEbts");
  const contractWithSigner = BlockchainSplitwise.connect(signer);
  const transaction = await contractWithSigner.updateDebt(
    debtor,
    creditor,
    newAmount
  );
  await transaction.wait();
}

async function getCallsOfFunction() {
  let users = new Set();
  let calls = await getAllFunctionCalls(contractAddress, "addIOU");
  for (let call of calls) {
    users.add(call.from);
    users.add(call.args[0]);
  }
  return Array.from(users);
}

// =============================================================================
//                              Provided Functions
// =============================================================================
// Reading and understanding these should help you implement the above

// This searches the block history for all calls to 'functionName' (string) on the 'addressOfContract' (string) contract
// It returns an array of objects, one for each call, containing the sender ('from'), arguments ('args'), and the timestamp ('t')
async function getAllFunctionCalls(addressOfContract, functionName) {
  var curBlock = await provider.getBlockNumber();
  var function_calls = [];

  while (curBlock !== GENESIS) {
    var b = await provider.getBlockWithTransactions(curBlock);
    var txns = b.transactions;
    for (var j = 0; j < txns.length; j++) {
      var txn = txns[j];

      // check that destination of txn is our contract
      if (txn.to == null) {
        continue;
      }
      if (txn.to.toLowerCase() === addressOfContract.toLowerCase()) {
        var func_call = abiDecoder.decodeMethod(txn.data);

        // check that the function getting called in this txn is 'functionName'
        if (func_call && func_call.name === functionName) {
          var timeBlock = await provider.getBlock(curBlock);
          var args = func_call.params.map(function (x) {
            return x.value;
          });
          function_calls.push({
            from: txn.from.toLowerCase(),
            args: args,
            t: timeBlock.timestamp,
          });
        }
      }
    }
    curBlock = b.parentHash;
  }
  return function_calls;
}

// We've provided a breadth-first search implementation for you, if that's useful
// It will find a path from start to end (or return null if none exists)
// You just need to pass in a function ('getNeighbors') that takes a node (string) and returns its neighbors (as an array)
async function doBFS(start, end, getNeighbors) {
  var queue = [[start]];
  console.log("starting bfs");
  while (queue.length > 0) {
    var cur = queue.shift();
    console.log("starting bfs :: antes del if");
    var lastNode = cur[cur.length - 1];
    if (lastNode.toLowerCase() === end.toString().toLowerCase()) {
      console.log("starting bfs :: entro al if");
      return cur;
    } else {
      var neighbors = await getNeighbors(lastNode);
      console.log("starting bfs:: else");
      for (var i = 0; i < neighbors.length; i++) {
        queue.push(cur.concat([neighbors[i]]));
      }
    }
  }
  console.log("starting bfs :: retorna null");
  return null;
}

// =============================================================================
//                                      UI
// =============================================================================

// This sets the default account on load and displays the total owed to that
// account.
provider.listAccounts().then((response) => {
  defaultAccount = response[0];

  getTotalOwed(defaultAccount).then((response) => {
    $("#total_owed").html("$" + response);
  });

  getLastActive(defaultAccount).then((response) => {
    time = timeConverter(response);
    $("#last_active").html(time);
  });
});

// This code updates the 'My Account' UI with the results of your functions
$("#myaccount").change(function () {
  defaultAccount = $(this).val();

  getTotalOwed(defaultAccount).then((response) => {
    $("#total_owed").html("$" + response);
  });

  getLastActive(defaultAccount).then((response) => {
    time = timeConverter(response);
    $("#last_active").html(time);
  });
});

// Allows switching between accounts in 'My Account' and the 'fast-copy' in 'Address of person you owe
provider.listAccounts().then((response) => {
  var opts = response.map(function (a) {
    return (
      '<option value="' + a.toLowerCase() + '">' + a.toLowerCase() + "</option>"
    );
  });
  $(".account").html(opts);
  $(".wallet_addresses").html(
    response.map(function (a) {
      return "<li>" + a.toLowerCase() + "</li>";
    })
  );
});

// This code updates the 'Users' list in the UI with the results of your function
getUsers().then((response) => {
  $("#all_users").html(
    response.map(function (u, i) {
      return "<li>" + u + "</li>";
    })
  );
});

// This runs the 'add_IOU' function when you click the button
// It passes the values from the two inputs above
$("#addiou").click(function () {
  defaultAccount = $("#myaccount").val(); //sets the default account
  add_IOU($("#creditor").val(), $("#amount").val()).then((response) => {
    window.location.reload(false); // refreshes the page after add_IOU returns and the promise is unwrapped
  });
});

// This is a log function, provided if you want to display things to the page instead of the JavaScript console
// Pass in a discription of what you're printing, and then the object to print
function log(description, obj) {
  $("#log").html(
    $("#log").html() +
      description +
      ": " +
      JSON.stringify(obj, null, 2) +
      "\n\n"
  );
}

// =============================================================================
//                                      TESTING
// =============================================================================

// This section contains a sanity check test that you can use to ensure your code
// works. We will be testing your code this way, so make sure you at least pass
// the given test. You are encouraged to write more tests!

// Remember: the tests will assume that each of the four client functions are
// async functions and thus will return a promise. Make sure you understand what this means.

function check(name, condition) {
  if (condition) {
    console.log(name + ": SUCCESS");
    return 3;
  } else {
    console.log(name + ": FAILED");
    return 0;
  }
}

async function sanityCheck() {
  console.log(
    "\nTEST",
    "Simplest possible test: only runs one add_IOU; uses all client functions: lookup, getTotalOwed, getUsers, getLastActive"
  );

  var score = 0;

  var accounts = await provider.listAccounts();
  defaultAccount = accounts[0];

  var users = await getUsers();
  score += check("getUsers() initially empty", users.length === 0);

  var owed = await getTotalOwed(accounts[1]);
  score += check("getTotalOwed(0) initially empty", owed === 0);

  var lookup_0_1 = await BlockchainSplitwise.lookup(accounts[0], accounts[1]);
  console.log("lookup(0, 1) current value" + lookup_0_1);
  score += check("lookup(0,1) initially 0", parseInt(lookup_0_1, 10) === 0);

  var response = await add_IOU(accounts[1], "10");

  users = await getUsers();
  score += check("getUsers() now length 2", users.length === 2);

  owed = await getTotalOwed(accounts[0]);
  score += check("getTotalOwed(0) now 10", owed === 10);

  lookup_0_1 = await BlockchainSplitwise.lookup(accounts[0], accounts[1]);
  score += check("lookup(0,1) now 10", parseInt(lookup_0_1, 10) === 10);

  var timeLastActive = await getLastActive(accounts[0]);
  var timeNow = Date.now() / 1000;
  var difference = timeNow - timeLastActive;
  score += check(
    "getLastActive(0) works",
    difference <= 60 && difference >= -3
  ); // -3 to 60 seconds

  console.log("Final Score: " + score + "/21");
}

// sanityCheck() //Uncomment this line to run the sanity check when you first open index.html
