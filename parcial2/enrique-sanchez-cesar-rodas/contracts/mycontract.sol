// SPDX-License-Identifier: UNLICENSED

// DO NOT MODIFY BELOW THIS
pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract Splitwise {
    struct Debt {
        address creditor;
        uint256 amount;
    }
    
    mapping(address => Debt[]) public debts;
    
    address[] public users;
    
    mapping(address => bool) public userExists;

    
    event IOUAdded(address indexed debtor, address indexed creditor, uint256 amount);

    
    function lookup(address debtor, address creditor) public view returns (uint256 ret) {
        for (uint i = 0; i < debts[debtor].length; i++) {
            if (debts[debtor][i].creditor == creditor) {
                return debts[debtor][i].amount;
            }
        }
        return 0;
    }
    
    
    function addIOU(address creditor, uint256 amount) public {
        require(msg.sender != creditor, "You cannot owe yourself");

        debts[msg.sender].push(Debt(creditor, amount));
        
        if (!userExists[msg.sender]) {
            users.push(msg.sender);
            userExists[msg.sender] = true;
        }
        if (!userExists[creditor]) {
            users.push(creditor);
            userExists[creditor] = true;
        }
        
        emit IOUAdded(msg.sender, creditor, amount);
        
        resolveDebts(msg.sender);
    }
    
    function resolveDebts(address debtor) internal {
        for (uint i = 0; i < debts[debtor].length; i++) {
            address creditor = debts[debtor][i].creditor;
            uint256 amount = debts[debtor][i].amount;
            
            for (uint j = 0; j < debts[creditor].length; j++) {
                if (debts[creditor][j].creditor == debtor) {
                    uint256 creditorAmount = debts[creditor][j].amount;
                    if (amount == creditorAmount) {
                        removeDebt(debtor, i);
                        removeDebt(creditor, j);
                        return;
                    } else if (amount > creditorAmount) {
                        debts[debtor][i].amount -= creditorAmount;
                        removeDebt(creditor, j);
                        return;
                    } else {
                        debts[creditor][j].amount -= amount;
                        removeDebt(debtor, i);
                        return;
                    }
                }
            }
        }
    }

    function removeDebt(address debtor, uint index) internal {
        uint lastIndex = debts[debtor].length - 1;
        if (index != lastIndex) {
            debts[debtor][index] = debts[debtor][lastIndex];
        }
        debts[debtor].pop();
    }
    
    function getAllUsers() public view returns (address[] memory) {
        return users;
    }
    
    function getTotalOwed(address user) public view returns (uint256 totalOwed) {
        for (uint i = 0; i < debts[user].length; i++) {
            totalOwed += debts[user][i].amount;
        }
    }
}
