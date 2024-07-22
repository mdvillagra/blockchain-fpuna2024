// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

 
// Your token contract
contract Token is Ownable, ERC20 {
    string private constant _symbol = "IVA";                 // TODO: Give your token a symbol (all caps!)
    string private constant _name = "ivachain";                   // TODO: Give your token a name
    bool public callmint ;


    constructor() ERC20(_name, _symbol) {
        callmint = true;
    }

    // ============================================================
    //                    FUNCTIONS TO IMPLEMENT
    // ============================================================

    function mint(uint amount) 
        public 
        onlyOwner
    {
        require( callmint == true , "Have been disable mint");
        _mint(msg.sender , amount);
    }

    function disable_mint()
        public
        onlyOwner
    {
        callmint = false;
    }

}