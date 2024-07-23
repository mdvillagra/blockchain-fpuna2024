// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;


import './token.sol';
import "hardhat/console.sol";


contract TokenExchange is Ownable {
    string public exchange_name = 'ENDOSWAP';

    // TODO: paste token contract address here
    address tokenAddr = 0x5FbDB2315678afecb367f032d93F642f64180aa3;                                  // TODO: paste token contract address here
    Token public token = Token(tokenAddr);                                

    // Liquidity pool for the exchange
    uint private token_reserves = 0;
    uint private eth_reserves = 0;

    // Rates
    uint private eth_to_endo_rate = 1;
    uint private endo_to_eth_rate = 1;

    // Fee Pools
    uint private token_fee_reserves = 0;
    uint private eth_fee_reserves = 0;

    // Liquidity pool shares
    mapping(address => uint) private lps;

    // For Extra Credit only: to loop through the keys of the lps mapping
    address[] private lp_providers;      

    // Total Pool Shares
    uint private total_shares = 0;

    // liquidity rewards
    uint private swap_fee_numerator = 3;                
    uint private swap_fee_denominator = 100;

    // Constant: x * y = k
    uint private k;

    uint private multiplier = 10**5;

    constructor() {}
    

    // Function createPool: Initializes a liquidity pool between your Token and ETH.
    // ETH will be sent to pool in this transaction as msg.value
    // amountTokens specifies the amount of tokens to transfer from the liquidity provider.
    // Sets up the initial exchange rate for the pool by setting amount of token and amount of ETH.
    function createPool(uint amountTokens)
        external
        payable
        onlyOwner
    {
        // This function is already implemented for you; no changes needed.

        // require pool does not yet exist:
        require (token_reserves == 0, "Token reserves was not 0");
        require (eth_reserves == 0, "ETH reserves was not 0.");

        // require nonzero values were sent
        require (msg.value > 0, "Need eth to create pool.");
        uint tokenSupply = token.balanceOf(msg.sender);
        require(amountTokens <= tokenSupply, "Not have enough tokens to create the pool");
        require (amountTokens > 0, "Need tokens to create pool.");

        token.transferFrom(msg.sender, address(this), amountTokens);
        token_reserves = token.balanceOf(address(this));
        eth_reserves = msg.value;
        k = token_reserves * eth_reserves;

        // Pool shares set to a large value to minimize round-off errors
        total_shares = 10**5;
        // Pool creator has some low amount of shares to allow autograder to run
        lps[msg.sender] = 100;

        eth_to_endo_rate = token_reserves / eth_reserves;
        endo_to_eth_rate = eth_reserves / token_reserves;
    }

    // For use for ExtraCredit ONLY
    // Function removeLP: removes a liquidity provider from the list.
    // This function also removes the gap left over from simply running "delete".
    function removeLP(uint index) private {
        require(index < lp_providers.length, "specified index is larger than the number of lps");
        lp_providers[index] = lp_providers[lp_providers.length - 1];
        lp_providers.pop();
    }

    // Function getSwapFee: Returns the current swap fee ratio to the client.
    function getSwapFee() public view returns (uint, uint) {
        return (swap_fee_numerator, swap_fee_denominator);
    }

    // Function getReserves
    function getReserves() public view returns (uint, uint) {
        console.log("ETH reserves ", eth_reserves);
        console.log("ENDO reserves", token_reserves);
        return (eth_reserves, token_reserves);
    }

    // ============================================================
    //                    FUNCTIONS TO IMPLEMENT
    // ============================================================
    
    /* ========================= Liquidity Provider Functions =========================  */ 

    // Function addLiquidity: Adds liquidity given a supply of ETH (sent to the contract as msg.value).
    // You can change the inputs, or the scope of your function, as needed.
    function addLiquidity() 
        external 
        payable
    {
        uint256 eths = msg.value;
        uint256 endos = eths * eth_to_endo_rate; // tokens convertidos de los eths

        console.log("ETHS ingresados: ", eths);
        console.log("ENDOS convertidos: ", endos);

        bool transfered = token.transferFrom(msg.sender, address(this), endos);
        console.log(transfered);
        require(transfered);
        lps[msg.sender] += endos;
        eth_reserves += eths;    //new eth reserves
        token_reserves += endos; //new token reserves

        eth_to_endo_rate = token_reserves / eth_reserves;
        endo_to_eth_rate = eth_reserves / token_reserves;

        k = eth_reserves * token_reserves;  //new k
    }


    // Function removeLiquidity: Removes liquidity given the desired amount of ETH to remove.
    // You can change the inputs, or the scope of your function, as needed.
    function removeLiquidity(uint amountETH)
        public
        payable
    {
        uint256 endos = amountETH * eth_to_endo_rate; // tokens convertidos de los eths
        require(endos < lps[msg.sender], "Provider sin liquides");
        uint new_token_reserves = token_reserves - endos;
        require(new_token_reserves > 0, "No hay suficiente Endo.");
        uint new_eth_reserves = eth_reserves - amountETH;
        require(new_eth_reserves > 0, "No hay suficiente Eth");
        bool transfered = token.transfer(msg.sender, endos);
        require(transfered);
        lps[msg.sender] -= endos;
        token_reserves = new_token_reserves;
        eth_reserves = new_eth_reserves;

        eth_to_endo_rate = token_reserves / eth_reserves;
        endo_to_eth_rate = eth_reserves / token_reserves;

        k = token_reserves * eth_reserves;
    }

    // Function removeAllLiquidity: Removes all liquidity that msg.sender is entitled to withdraw
    // You can change the inputs, or the scope of your function, as needed.
    function removeAllLiquidity()
        external
        payable
    {
        uint new_token_reserves = token_reserves - lps[msg.sender];
        require(new_token_reserves > 0, "No hay suficiente Endo");
        uint eths = lps[msg.sender] * endo_to_eth_rate;

        uint new_eth_reserves = eth_reserves - eths;
        require(new_eth_reserves > 0, "No hay suficiente Eth");
        bool transfered = token.transfer(msg.sender, lps[msg.sender]);
        require(transfered);
        lps[msg.sender] = 0;
        token_reserves = new_token_reserves;
        eth_reserves = new_eth_reserves;

        eth_to_endo_rate = token_reserves / eth_reserves;
        endo_to_eth_rate = eth_reserves / token_reserves;
        
        k = token_reserves * eth_reserves;
    }
    /***  Define additional functions for liquidity fees here as needed ***/


    /* ========================= Swap Functions =========================  */ 

    // Function swapTokensForETH: Swaps your token with ETH
    // You can change the inputs, or the scope of your function, as needed.
    function swapTokensForETH(uint amountTokens)
        external 
        payable
    {
        uint eths = amountTokens * endo_to_eth_rate;
        
        uint new_eth_reserves = eth_reserves - eths;
        require(new_eth_reserves > 0);
        bool transfered = token.transferFrom(msg.sender, address(this), amountTokens);
        require(transfered);

        token_reserves += amountTokens;
        eth_reserves = new_eth_reserves;

        eth_to_endo_rate = token_reserves / eth_reserves;
        endo_to_eth_rate = eth_reserves / token_reserves;
        
        k = token_reserves * eth_reserves;
        console.log("New ETH reserve: ", new_eth_reserves);
    }



    // Function swapETHForTokens: Swaps ETH for your tokens
    // ETH is sent to contract as msg.value
    // You can change the inputs, or the scope of your function, as needed.
    function swapETHForTokens() 
        external
        payable 
    {
        uint eths = msg.value;
        uint endos = eths * eth_to_endo_rate;
        uint new_token_reserves = token_reserves - endos;
        require(new_token_reserves > 0);
        bool transfered = token.transfer(msg.sender, endos);
        require(transfered);
        token_reserves = new_token_reserves;
        eth_reserves += eths;

        eth_to_endo_rate = token_reserves / eth_reserves;
        endo_to_eth_rate = eth_reserves / token_reserves;
        
        k = token_reserves * eth_reserves;
        console.log("New ENDO reserve: ", new_token_reserves);
    }
}