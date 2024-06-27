// SPDX-License-Identifier: UNLICENSED

// DO NOT MODIFY BELOW THIS
pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract Splitwise {
    mapping(address => mapping(address => uint)) public debts;
    mapping(address => uint) public lastActive;

    function add_IOU(address creditor, uint amount) public {
        debts[msg.sender][creditor] += amount;
        lastActive[msg.sender] = block.timestamp;
        lastActive[creditor] = block.timestamp;
    }

    function lookup(address debtor, address creditor) public view returns (uint) {
        return debts[debtor][creditor];
    }

    function getLastActive(address user) public view returns (uint) {
        return lastActive[user];
    }
}

