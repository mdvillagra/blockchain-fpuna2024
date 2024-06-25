// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Splitwise {
    // Structure representing a debt
    struct Debt {
        uint32 amount;
    }

    // Mapping to keep track of debts between debtors and creditors
    mapping(address => mapping(address => Debt)) public debts;

    // Function to return the amount a debtor owes to a creditor
    function lookup(address debtor, address creditor) public view returns (uint32) {
        return debts[debtor][creditor].amount;
    }

    // Function to add a debt (IOU)
    function add_IOU(address creditor, uint32 amount) public {
        require(amount > 0, "Amount must be positive");

        debts[msg.sender][creditor].amount += amount;
    }
}
