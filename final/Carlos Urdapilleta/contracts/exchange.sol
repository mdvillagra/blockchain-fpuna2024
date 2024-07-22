// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;


import './token.sol';
import "hardhat/console.sol";


contract TokenExchange is Ownable {
    string public exchange_name = 'block_exchange';

    address tokenAddr = 0x5FbDB2315678afecb367f032d93F642f64180aa3;
    Token public token = Token(tokenAddr);

    // Liquidity pool for the exchange
    uint private token_reserves = 0;
    uint private eth_reserves = 0;

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
    uint private swap_fee_numerator = 0;
    uint private swap_fee_denominator = 0;

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
        lps[msg.sender] = 0;
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
        require(msg.value > 0, "Must receive at least one ETH");
        uint amountTokens = (msg.value * token_reserves) / eth_reserves;
        require(amountTokens > 0, "Must receive at least one token");
        bool success = token.transferFrom(msg.sender, address(this), amountTokens);
        require(success, "Token transfer failed");
        token_reserves += amountTokens;
        eth_reserves += msg.value;
        total_shares += amountTokens;
        lps[msg.sender] += amountTokens;
        k = token_reserves * eth_reserves;
    }


    // Function removeLiquidity: Removes liquidity given the desired amount of ETH to remove.
    // You can change the inputs, or the scope of your function, as needed.
    function removeLiquidity(uint amountETH)
        public
        payable
    {
        uint amountTokens = (amountETH * token_reserves) / eth_reserves;
        require(amountTokens < lps[msg.sender], "Insufficient liquidity provider shares");
        require(amountTokens > 0, "Must remove at least one token");
        uint new_tok_pool = token_reserves - amountTokens;
        require(new_tok_pool > 0, "Not enough tokens in the contract");
        uint new_ETH_pool = eth_reserves - amountETH;
        require(new_ETH_pool > 0, "Not enough ETH in the contract");
        bool success = token.transfer(msg.sender, amountTokens);
        require(success, "Token transfer failed");
        (success, ) = msg.sender.call{value: amountETH}("");
        require(success, "ETH transfer failed");
        token_reserves = new_tok_pool;
        eth_reserves = new_ETH_pool;
        total_shares -= amountTokens;
        lps[msg.sender] -= amountTokens;
        k = token_reserves * eth_reserves;
    }

    // Function removeAllLiquidity: Removes all liquidity that msg.sender is entitled to withdraw
    // You can change the inputs, or the scope of your function, as needed.
    function removeAllLiquidity()
        external
        payable
    {
        uint new_tok_pool = token_reserves - lps[msg.sender];
        require(new_tok_pool > 0, "Not enough tokens in the contract");
        uint amountETH = (lps[msg.sender] * eth_reserves) / token_reserves;
        require(amountETH > 0, "Must remove at least one ETH");
        uint new_ETH_pool = eth_reserves - amountETH;
        require(new_ETH_pool > 0, "Not enough ETH in the contract");
        bool success = token.transfer(msg.sender, lps[msg.sender]);
        require(success, "Token transfer failed");
        (success, ) = msg.sender.call{value: amountETH}("");
        require(success, "ETH transfer failed");
        token_reserves = new_tok_pool;
        eth_reserves = new_ETH_pool;
        total_shares -= lps[msg.sender];
        lps[msg.sender] = 0;
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
        require(eth_reserves > 0 && token_reserves > 0, "Pool reserves must be initialized");
        uint amountETH = (amountTokens * eth_reserves) / token_reserves;
        // no sera 0 porque debe estar en el rango: 0 < ETH < eth_reserves
        require(amountETH < eth_reserves, "Not enough ETH in the contract");
        require(amountETH > 0, "Must send at least one ETH");
        uint new_ETH_pool = eth_reserves - amountETH;
        bool success = token.transferFrom(msg.sender, address(this), amountTokens);
        require(success, "Token transfer failed");
       (success, ) = msg.sender.call{value: amountETH}("");
        require(success, "ETH transfer failed");
        token_reserves += amountTokens;
        eth_reserves = new_ETH_pool;
    }



    // Function swapETHForTokens: Swaps ETH for your tokens
    // ETH is sent to contract as msg.value
    // You can change the inputs, or the scope of your function, as needed.
    function swapETHForTokens()
        external
        payable
    {
        require(eth_reserves > 0 && token_reserves > 0, "Pool reserves must be initialized");
        uint amountTokens = (msg.value * token_reserves) / eth_reserves;
        // no sera 0 porque debe estar en el rango: 0 < token < token_reserves
        require(amountTokens < token_reserves, "Not enough tokens in the contract");
        require(amountTokens > 0, "Must receive at least one token");
        uint new_tok_pool = token_reserves - amountTokens;
        bool success = token.transfer(msg.sender, amountTokens);
        require(success, "Token transfer failed");
        token_reserves = new_tok_pool;
        eth_reserves += msg.value;
    }
}
