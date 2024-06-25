// =============================================================================
//                                  Config
// =============================================================================
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
var defaultAccount;

// Constant we use later
var GENESIS = '0x0000000000000000000000000000000000000000000000000000000000000000';

// This is the ABI for your contract (get it from Remix, in the 'Compile' tab)
// ============================================================
var abi = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "debtor",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "creditor",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "amount",
          "type": "uint32"
        }
      ],
      "name": "IOUAdded",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "creditor",
          "type": "address"
        },
        {
          "internalType": "uint32",
          "name": "amount",
          "type": "uint32"
        },
        {
          "internalType": "address[]",
          "name": "cycle",
          "type": "address[]"
        }
      ],
      "name": "add_IOU",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "debts",
      "outputs": [
        {
          "internalType": "uint32",
          "name": "amount",
          "type": "uint32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "debtor",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "creditor",
          "type": "address"
        }
      ],
      "name": "lookup",
      "outputs": [
        {
          "internalType": "uint32",
          "name": "",
          "type": "uint32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
];

// ============================================================
abiDecoder.addABI(abi);

var contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

var signer = provider.getSigner();

async function printInitialDeudor(message) { 
    const siig = await signer.getAddress();
    console.log(message + " :" + siig);
}
printInitialDeudor("initialSigner");

var BlockchainSplitwise = new ethers.Contract(contractAddress, abi, signer);

// =============================================================================
//                            Functions To Implement
// =============================================================================

//OK
// Helper function to get all IOU calls
async function getAllIOUCalls() {
    const iouCalls = await getAllFunctionCalls(contractAddress, "add_IOU");
    return iouCalls;
}

//OK
// TODO: Return a list of all users (creditors or debtors) in the system
async function getUsers() {
    const iouCalls = await getAllIOUCalls();
    const users = new Set();

    console.log(iouCalls);
    iouCalls.forEach(call => {
        users.add(call.from);
        users.add(call.args[0]);
    });

    console.log(Array.from(users))
    return Array.from(users);
}

async function getTotalOwed(user) {
    const users = await getUsers();
    let totalOwed = 0;
    for (const creditor of users) {
        if (user !== creditor) {
            const amount = await lookup(user, creditor);
            totalOwed += amount;
        }
    }
    return totalOwed;
}

// TODO: Get the last time this user has sent or received an IOU, in seconds since Jan. 1, 1970
async function getLastActive(user) {
    const iouCalls = await getAllIOUCalls();
    const userCalls = iouCalls.filter(call => call.from === user || call.args[0] === user);

    if (userCalls.length === 0) {
        return null;
    }

    const lastCall = userCalls.reduce((max, call) => call.t > max.t ? call : max);
    return lastCall.t;
}

// TODO: add an IOU ('I owe you') to the system
async function add_IOU(creditor, amount) {

    // Detect potential cycle
    console.log("El que esta adeudando: "+defaultAccount)
    console.log("Antes de FindCycle")
    console.log(JSON.stringify(creditor))
    const cycle = await findCycle(creditor, defaultAccount, amount);

    console.log("cycle" + JSON.stringify(cycle));
    // Call add_IOU on the smart contract
    const tx = await BlockchainSplitwise.add_IOU(creditor, amount, cycle);


    await tx.wait();
}


// =============================================================================
//                              Utils Functions
// =============================================================================

// Helper function to lookup debt
async function lookup(debtor, creditor) {
    console.log("calling Lookup ")
    const currentSigner = provider.getSigner(debtor);
    console.log("1")

    const BlockchainSplitwiseWithSigner = BlockchainSplitwise.connect(currentSigner);
    console.log("2 ")

    const amount = await BlockchainSplitwiseWithSigner.lookup(debtor,creditor);
    console.log("3")

    return ethers.BigNumber.from(amount).toNumber();
}

// Helper function to detect cycles
async function findCycle(start, end, amount) {
    const users = await getUsers();
    const visited = new Set();
    const stack = [];
    const cycle = [];

    async function dfs(current) {
        if (current === end) {
            cycle.push(...stack, current);
            return true;
        }
        visited.add(current);
        stack.push(current);

        for (const user of users) {
            if (!visited.has(user)) {
                const debtAmount = await lookup(current, user);
                if (debtAmount > 0) {
                    if (await dfs(user)) {
                        return true;
                    }
                }
            }
        }

        stack.pop();
        return false;
    }

    if (await dfs(start)) {
        return cycle;
    }

    return [];
}

// =============================================================================
//                              Provided Functions
// =============================================================================


async function getAllFunctionCalls(addressOfContract, functionName) {
    var curBlock = await provider.getBlockNumber();
    var function_calls = [];

    while (curBlock !== GENESIS) {
        var b = await provider.getBlockWithTransactions(curBlock);
        var txns = b.transactions;
        for (var j = 0; j < txns.length; j++) {
            var txn = txns[j];

            if (txn.to == null) { continue; }
            if (txn.to.toLowerCase() === addressOfContract.toLowerCase()) {
                var func_call = abiDecoder.decodeMethod(txn.data);

                if (func_call && func_call.name === functionName) {
                    var timeBlock = await provider.getBlock(curBlock);
                    var args = func_call.params.map(function (x) { return x.value });
                    function_calls.push({
                        from: txn.from.toLowerCase(),
                        args: args,
                        t: timeBlock.timestamp
                    })
                }
            }
        }
        curBlock = b.parentHash;
    }
    return function_calls;
}
// =============================================================================
//                                      UI
// =============================================================================

async function updateSigner(account) {
    signer = provider.getSigner(account);
    BlockchainSplitwise = BlockchainSplitwise.connect(signer);
    await printInitialDeudor("Updated Signer");
}

//Carga inicial de la cuenta y su totalOwed
provider.listAccounts().then((response) => {
    defaultAccount = response[0];    
    updateSigner(defaultAccount).then(() => {
        getTotalOwed(defaultAccount).then((response) => {
            $("#total_owed").html("$" + response);
        });

        getLastActive(defaultAccount).then((response) => {
            const time = timeConverter(response);
            $("#last_active").html(time);
        });
    });
});

//El change de la myaccount
$("#myaccount").change(function () {
    defaultAccount = $(this).val();
    updateSigner(defaultAccount).then(() => {
        getTotalOwed(defaultAccount).then((response) => {
            $("#total_owed").html("$" + response);
        });

        getLastActive(defaultAccount).then((response) => {
            const time = timeConverter(response);
            $("#last_active").html(time);
        });
    });
});

//Este carga el select y las lista de direcciones
provider.listAccounts().then((response) => {
    const opts = response.map(function (a) { return '<option value="' + a.toLowerCase() + '">' + a.toLowerCase() + '</option>' });
    $(".account").html(opts);
    $(".wallet_addresses").html(response.map(function (a) { return '<li>' + a.toLowerCase() + '</li>' }));
});

//Lista la lista de usuarios que haya recibido o enviado un pagare
getUsers().then((response) => {
    $("#all_users").html(response.map(function (u, i) { return "<li>" + u + "</li>" }));
});

const delay = ms => new Promise(res => setTimeout(res, ms));


//Elemento del boton.
$("#addiou").click(function () {
	console.log("Calling add_IOU")
    add_IOU($("#creditor").val(), $("#amount").val()).then(async (response) => {

		console.log("Waiting 5s");

		await delay(5000);
		
		window.location.reload(false);
    });
});


function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var year = a.getFullYear();
    var month = ('0' + (a.getMonth() + 1)).slice(-2);
    var date = ('0' + a.getDate()).slice(-2);
    var hour = ('0' + a.getHours()).slice(-2);
    var min = ('0' + a.getMinutes()).slice(-2);
    var sec = ('0' + a.getSeconds()).slice(-2);
    var time = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec;
    return time;
}
