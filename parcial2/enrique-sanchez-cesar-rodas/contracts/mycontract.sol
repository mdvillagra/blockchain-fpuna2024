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
    event DebtRemoved(address indexed debtor, address indexed creditor);
    event DebtUpdated(address indexed debtor, address indexed creditor, uint256 newAmount);

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
    }
    
    function getCreditors(address debtor) public view returns (address[] memory) {
        uint length = debts[debtor].length;
        address[] memory creditors = new address[](length);
        for (uint i = 0; i < length; i++) {
            creditors[i] = debts[debtor][i].creditor;
        }
        return creditors;
    }

    function removeDebt(address debtor, address creditor) public {
        for (uint i = 0; i < debts[debtor].length; i++) {
            if (debts[debtor][i].creditor == creditor) {
                debts[debtor][i] = debts[debtor][debts[debtor].length - 1];
                debts[debtor].pop();
                emit DebtRemoved(debtor, creditor);
                break;
            }
        }
    }

    function updateDebt(address debtor, address creditor, uint256 newAmount) public {
        for (uint i = 0; i < debts[debtor].length; i++) {
            if (debts[debtor][i].creditor == creditor) {
                debts[debtor][i].amount = newAmount;
                emit DebtUpdated(debtor, creditor, newAmount);
                break;
            }
        }
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
