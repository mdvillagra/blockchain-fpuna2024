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
        for (uint256 i = 0; i < debts[debtor].length; i++) {
            if (debts[debtor][i].creditor == creditor) {
                return debts[debtor][i].amount;
            }
        }
        return 0;
    }
    function getSmallestEdge(address[] calldata path) private view returns(uint256){
        uint256 smallEdge = lookup(path[0], path[1]);
        uint256 edge;

        for (uint256 i = 0; i < path.length; i++) {
            for(uint256 j = 0; j < debts[path[i]].length; j++){
                if( debts[path[i]][j].creditor == path[(i + 1) % path.length] ){
                    edge = debts[path[i]][j].amount;  
                    if (edge < smallEdge) {
                        smallEdge = edge;
                    }
                }
            }
        }
        return smallEdge;
    }
    function removeNeighbor(address debtor, address creditor) private {
        for (uint256 i = 0; i < debts[debtor].length; i++) {
            if (debts[debtor][i].creditor == creditor) {
                delete debts[debtor][i];
            }
        }
    }
    function addIOU(address creditor, uint256 amount, address[] calldata path) public {
        uint256 hasCreditor = 0;
        uint256 i = 0;
        uint256 j = 0;
        uint256 smallEdge = 0;
        require(msg.sender != creditor, "You cannot owe yourself");
        for (i = 0; i < debts[msg.sender].length; i++) {
            if (debts[msg.sender][i].creditor == creditor) {
                hasCreditor = 1;
            }
        }
        if(hasCreditor==0){
            debts[msg.sender].push(Debt(creditor, 0));
        }
        for (i = 0; i < debts[msg.sender].length; i++) {
            if (debts[msg.sender][i].creditor == creditor) {
                debts[msg.sender][i].amount += amount;
            }
        }
        if (!userExists[msg.sender]) {
            users.push(msg.sender);
            userExists[msg.sender] = true;
        }
        if (!userExists[creditor]) {
            users.push(creditor);
            userExists[creditor] = true;
        }
        if(path.length>0){
            smallEdge = getSmallestEdge(path);
            for (i = 0; i < path.length; i++) { // resolve the loop
                for(j = 0; j < debts[path[i]].length; j++){
                    if( debts[path[i]][j].creditor == path[(i + 1) % path.length] ){
                        debts[path[i]][j].amount -= smallEdge;
                        if (debts[path[i]][j].amount == 0) { // remove neighbor if
                            removeNeighbor(path[i], path[(i + 1) % path.length]); // no remaining debt
                        }
                    }
                }
            }
        }
        emit IOUAdded(msg.sender, creditor, amount);
    }
    
    function getCreditors(address debtor) public view returns (address[] memory) {
        uint256 length = debts[debtor].length;
        address[] memory creditors = new address[](length);
        for (uint256 i = 0; i < length; i++) {
            creditors[i] = debts[debtor][i].creditor;
        }
        return creditors;
    }

    function removeDebt(address debtor, address creditor) public {
        for (uint256 i = 0; i < debts[debtor].length; i++) {
            if (debts[debtor][i].creditor == creditor) {
                debts[debtor][i] = debts[debtor][debts[debtor].length - 1];
                debts[debtor].pop();
                emit DebtRemoved(debtor, creditor);
                break;
            }
        }
    }

    function updateDebt(address debtor, address creditor, uint256 newAmount) public {
        for (uint256 i = 0; i < debts[debtor].length; i++) {
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
        for (uint256 i = 0; i < debts[user].length; i++) {
            totalOwed += debts[user][i].amount;
        }
    }
}
