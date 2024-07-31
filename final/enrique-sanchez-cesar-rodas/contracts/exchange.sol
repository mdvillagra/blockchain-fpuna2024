// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;


import './token.sol';
import "hardhat/console.sol";


contract TokenExchange is Ownable {
    string public exchange_name = 'exchange';

    // TODO: paste token contract address here
    // e.g. tokenAddr = 0x5FbDB2315678afecb367f032d93F642f64180aa3
    address tokenAddr;                                  // TODO: paste token contract address here
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
    function addLiquidity() external payable {
    uint256 eth_amount = msg.value;

    // Ensure the ETH amount is greater than zero
    require(eth_amount > 0, "Must receive at least one ETH");

    // Calculate the required amount of tokens
    uint256 token_amount = (eth_amount * token_reserves) / eth_reserves;

    // Ensure the token amount is greater than zero
    require(token_amount > 0, "Must receive at least one token");

    // Transfer the tokens from the sender to the contract
    require(token.transferFrom(msg.sender, address(this), token_amount), "Token transfer failed");

    // Update the reserves
    token_reserves += token_amount;
    eth_reserves += eth_amount;
    
    // Update the constant product
    k = token_reserves * eth_reserves;

    // Calculate the shares for the liquidity provider
    uint256 shares = (eth_amount * total_shares) / eth_reserves;

    // Update the liquidity provider's shares and the total shares
    lps[msg.sender] += shares;
    total_shares += shares;

    // Record the liquidity provider
    lp_providers.push(msg.sender);
}



    // Function removeLiquidity: Removes liquidity given the desired amount of ETH to remove.
    // You can change the inputs, or the scope of your function, as needed.
    function removeLiquidity(uint amountETH)
        public 
        payable
    {
            // Calculate the amount of tokens to be removed based on the ETH amount
        uint256 amountTokens = (amountETH * token_reserves) / eth_reserves;
        
        // Calculate the shares to be removed
        uint256 shares = (amountETH * total_shares) / eth_reserves;

        // Ensure the user has enough shares to remove the liquidity
        require(lps[msg.sender] >= shares, "Not enough shares");
        // Ensure the amount of tokens to be removed is valid
        require(amountTokens > 0, "Must remove at least one token");

        // Ensure the contract has enough tokens and ETH to fulfill the removal
        uint256 new_tok_pool = token_reserves - amountTokens;
        require(new_tok_pool > 0, "Not enough tokens in the contract");
        uint256 new_ETH_pool = eth_reserves - amountETH;
        require(new_ETH_pool > 0, "Not enough ETH in the contract");

        // Transfer the tokens to the user
        require(token.transfer(msg.sender, amountTokens), "Token transfer failed");

        // Transfer the ETH to the user
        (bool success, ) = msg.sender.call{value: amountETH}("");
        require(success, "ETH transfer failed");

        // Update the reserves
        token_reserves = new_tok_pool;
        eth_reserves = new_ETH_pool;

        // Update the constant product
        k = token_reserves * eth_reserves;

        // Update the liquidity provider's shares and the total shares
        lps[msg.sender] -= shares;
        total_shares -= shares;
    }

    // Function removeAllLiquidity: Removes all liquidity that msg.sender is entitled to withdraw
    // You can change the inputs, or the scope of your function, as needed.
    function removeAllLiquidity()
        external
        payable
    {
        uint shares = lps[msg.sender];
    
        // Ensure the user has provided liquidity
        require(shares > 0, "No liquidity provided");

        // Calculate the amount of ETH and tokens to be removed
        uint amountETH = (shares * eth_reserves) / total_shares;
        uint token_amount = (shares * token_reserves) / total_shares;

        // Ensure the new token and ETH pools will be positive
        uint new_tok_pool = token_reserves - token_amount;
        require(new_tok_pool > 0, "Not enough tokens in the contract");
        uint new_ETH_pool = eth_reserves - amountETH;
        require(new_ETH_pool > 0, "Not enough ETH in the contract");

        // Transfer the tokens to the user
        require(token.transfer(msg.sender, token_amount), "Token transfer failed");

        // Transfer the ETH to the user
        (bool success, ) = msg.sender.call{value: amountETH}("");
        require(success, "ETH transfer failed");

        // Update the reserves and shares
        token_reserves = new_tok_pool;
        eth_reserves = new_ETH_pool;
        k = token_reserves * eth_reserves;
        total_shares -= shares;
        lps[msg.sender] = 0;
    }
    /***  Define additional functions for liquidity fees here as needed ***/


    /* ========================= Swap Functions =========================  */ 

    // Function swapTokensForETH: Swaps your token with ETH
    // You can change the inputs, or the scope of your function, as needed.
    function swapTokensForETH(uint amountTokens)
        external 
        payable
    {
            // Ensure the pool reserves are initialized
        require(eth_reserves > 0 && token_reserves > 0, "Pool reserves must be initialized");

        // Calculate the amount of ETH to be swapped based on the token amount
        uint256 amountETH = (amountTokens * eth_reserves) / token_reserves;

        // Ensure the amount of ETH to be swapped is within valid bounds
        require(amountETH > 0, "Must swap at least one token's worth of ETH");
        require(amountETH < eth_reserves, "Not enough ETH in the contract");

        // Transfer the tokens from the user to the contract
        require(token.transferFrom(msg.sender, address(this), amountTokens), "Token transfer failed");

        // Transfer the ETH to the user
        (bool success, ) = msg.sender.call{value: amountETH}("");
        require(success, "ETH transfer failed");

        // Update the reserves
        token_reserves += amountTokens;
        eth_reserves -= amountETH;

        // Update the constant product
        k = token_reserves * eth_reserves;
    }



    // Function swapETHForTokens: Swaps ETH for your tokens
    // ETH is sent to contract as msg.value
    // You can change the inputs, or the scope of your function, as needed.
    function swapETHForTokens()
        external
        payable 
    {
            // Ensure the pool reserves are initialized
        require(eth_reserves > 0 && token_reserves > 0, "Pool reserves must be initialized");

        // Calculate the amount of tokens to be swapped based on the ETH amount
        uint256 eth_amount = msg.value;
        uint256 token_amount = (eth_amount * token_reserves) / eth_reserves;

        // Ensure the token amount is within valid bounds
        require(token_amount > 0, "Must receive at least one token");
        require(token_amount < token_reserves, "Not enough tokens in the contract");

        // Transfer the tokens to the user
        require(token.transfer(msg.sender, token_amount), "Token transfer failed");

        // Update the reserves
        token_reserves -= token_amount;
        eth_reserves += eth_amount;

        // Update the constant product
        k = token_reserves * eth_reserves;
    }
}