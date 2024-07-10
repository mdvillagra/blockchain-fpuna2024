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
          "name": "",
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
        },
        {
          "internalType": "uint32",
          "name": "amount",
          "type": "uint32"
        }
      ],
      "name": "reduceDebt",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
abiDecoder.addABI(abi);
// call abiDecoder.decodeMethod to use this - see 'getAllFunctionCalls' for more

var contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // FIXME: fill this in with your contract's address/hash

var BlockchainSplitwise = new ethers.Contract(contractAddress, abi, provider.getSigner());

// =============================================================================
//                            Functions To Implement
// =============================================================================

let signer;
let BlockchainSplitwiseWithSigner;

/**
 * Función auxiliar para obtener los vecinos de un usuario (todos los acreedores a los que el usuario debe).
 * @param {string} user - Dirección del usuario.
 * @returns {Array} neighbors - Lista de acreedores.
 */
async function getNeighbors(user) {
    let neighbors = [];
    let users = await getUsers();
    for (let i = 0; i < users.length; i++) {
        let creditor = users[i];
        let debt = await BlockchainSplitwise.lookup(user, creditor);
        if (debt > 0) {
            neighbors.push(creditor);
        }
    }
    return neighbors;
}

/**
 * Función para resolver deudas usando BFS y ajustar las deudas en consecuencia.
 * @param {string} debtor - Dirección del deudor.
 * @param {string} creditor - Dirección del acreedor.
 * @param {number} amount - Monto de la deuda.
 */
async function resolveDebts(debtor, creditor, amount) {
    // Primero, agrega la nueva deuda
    await BlockchainSplitwiseWithSigner.add_IOU(creditor, amount);

    // Luego, encuentra y resuelve ciclos
    let path = await findCycle(debtor, creditor);
    console.log("Cycle path:", path);

    if (path.length > 1) { // Se asegura de que haya un ciclo válido
        // Encuentra la deuda mínima en el ciclo
        let minDebt = amount;
        for (let i = 0; i < path.length - 1; i++) {
            let debt = await BlockchainSplitwise.lookup(path[i], path[i + 1]);
            minDebt = Math.min(minDebt, debt);
        }
        console.log("Minimum debt in cycle:", minDebt);

        // Resta la deuda mínima de todas las deudas en el ciclo
        for (let i = 0; i < path.length - 1; i++) {
            let debtor = path[i];
            let creditor = path[i + 1];
            await BlockchainSplitwiseWithSigner.reduceDebt(debtor, creditor, minDebt);
        }
    }
}

/**
 * Función para agregar un IOU ('I owe you') al sistema.
 * @param {string} creditor - Dirección del acreedor.
 * @param {number} amount - Monto de la deuda.
 */
async function add_IOU(creditor, amount) {
    BlockchainSplitwiseWithSigner = BlockchainSplitwise.connect(signer);
    await resolveDebts(defaultAccount, creditor, parseInt(amount));
}

/**
 * Función para encontrar un ciclo en el grafo de deudas.
 * @param {string} start - Dirección de inicio.
 * @param {string} end - Dirección de fin.
 * @returns {Array} path - Camino que representa el ciclo.
 */
async function findCycle(start, end) {
    let queue = [[start]];
    let visited = new Set();
    let parent = {};

    while (queue.length > 0) {
        let path = queue.shift();
        let node = path[path.length - 1];

        if (!visited.has(node)) {
            visited.add(node);
            let neighbors = await getNeighbors(node);
            for (let neighbor of neighbors) {
                if (neighbor === start) {
                    // Found a cycle
                    path.push(start);
                    return path;
                }

                if (!visited.has(neighbor)) {
                    parent[neighbor] = node;
                    let newPath = path.slice();
                    newPath.push(neighbor);
                    queue.push(newPath);
                }
            }
        }
    }

    return [];
}

/**
 * Función para devolver una lista de todos los usuarios (acreedores o deudores) en el sistema.
 * @returns {Array} users - Lista de usuarios.
 */
async function getUsers() {
    let users = new Set();
    let calls = await getAllFunctionCalls(contractAddress, 'add_IOU');
    for (let call of calls) {
        users.add(call.from);
        users.add(call.args[0]);
    }
    return Array.from(users);
}

/**
 * Función para obtener el monto total que debe el usuario especificado por 'user'.
 * @param {string} user - Dirección del usuario.
 * @returns {number} totalOwed - Monto total que debe el usuario.
 */
async function getTotalOwed(user) {
    signer = provider.getSigner(user);
    let totalOwed = 0;
    let users = await getUsers();
    for (let i = 0; i < users.length; i++) {
        let creditor = users[i];
        if (user.toLowerCase() !== creditor.toLowerCase()) {
            let owed = await BlockchainSplitwise.lookup(user, creditor);
            totalOwed += parseInt(owed);
        }
    }
    return totalOwed;
}

/**
 * Función para obtener el monto total que debe el usuario especificado por 'user'.
 * @param {string} user - Dirección del usuario.
 * @returns {number} totalOwed - Monto total que debe el usuario.
 */
async function getLastActive(user) {
    let lastActive = null;
    let calls = await getAllFunctionCalls(contractAddress, 'add_IOU');
    for (let call of calls) {
        if (call.from.toLowerCase() === user.toLowerCase() || call.args[0].toLowerCase() === user.toLowerCase()) {
            if (!lastActive || call.t > lastActive) {
                lastActive = call.t;
            }
        }
    }
    return lastActive;
}

// =============================================================================
//                              Provided Functions
// =============================================================================

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
                    });
                }
            }
        }
        curBlock = b.parentHash;
    }
    return function_calls;
}

// Breadth-first search implementation to find a path from start to end (or return null if none exists)
// You just need to pass in a function ('getNeighbors') that takes a node (string) and returns its neighbors (as an array)
async function doBFS(start, end, getNeighbors) {
    var queue = [[start]];
    while (queue.length > 0) {
        var cur = queue.shift();
        var lastNode = cur[cur.length - 1];
        if (lastNode.toLowerCase() === end.toString().toLowerCase()) {
            return cur;
        } else {
            var neighbors = await getNeighbors(lastNode);
            for (var i = 0; i < neighbors.length; i++) {
                queue.push(cur.concat([neighbors[i]]));
            }
        }
    }
    return null;
}

// =============================================================================
//                                      UI
// =============================================================================

// This sets the default account on load and displays the total owed to that
// account.
provider.listAccounts().then((response)=> {
	defaultAccount = response[0];

	getTotalOwed(defaultAccount).then((response)=>{
		$("#total_owed").html("$"+response);
	});

	getLastActive(defaultAccount).then((response)=>{
		time = timeConverter(response)
		$("#last_active").html(time)
	});
});

// This code updates the 'My Account' UI with the results of your functions
$("#myaccount").change(function() {
	defaultAccount = $(this).val();

	getTotalOwed(defaultAccount).then((response)=>{
		$("#total_owed").html("$"+response);
	})

	getLastActive(defaultAccount).then((response)=>{
		time = timeConverter(response)
		$("#last_active").html(time)
	});
});

// Allows switching between accounts in 'My Account' and the 'fast-copy' in 'Address of person you owe
provider.listAccounts().then((response)=>{
	var opts = response.map(function (a) { return '<option value="'+
			a.toLowerCase()+'">'+a.toLowerCase()+'</option>' });
	$(".account").html(opts);
	$(".wallet_addresses").html(response.map(function (a) { return '<li>'+a.toLowerCase()+'</li>' }));
});

// This code updates the 'Users' list in the UI with the results of your function
getUsers().then((response)=>{
	$("#all_users").html(response.map(function (u,i) { return "<li>"+u+"</li>" }));
});

// This runs the 'add_IOU' function when you click the button
// It passes the values from the two inputs above
$("#addiou").click(function() {
	defaultAccount = $("#myaccount").val(); //sets the default account
  add_IOU($("#creditor").val(), $("#amount").val()).then((response)=>{
		window.location.reload(false); // refreshes the page after add_IOU returns and the promise is unwrapped
	})
});

// This is a log function, provided if you want to display things to the page instead of the JavaScript console
// Pass in a discription of what you're printing, and then the object to print
function log(description, obj) {
	$("#log").html($("#log").html() + description + ": " + JSON.stringify(obj, null, 2) + "\n\n");
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
	console.log ("\nTEST", "Simplest possible test: only runs one add_IOU; uses all client functions: lookup, getTotalOwed, getUsers, getLastActive");

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
	var timeNow = Date.now()/1000;
	var difference = timeNow - timeLastActive;
	score += check("getLastActive(0) works", difference <= 60 && difference >= -3); // -3 to 60 seconds

	console.log("Final Score: " + score +"/21");
}

// sanityCheck() //Uncomment this line to run the sanity check when you first open index.html
