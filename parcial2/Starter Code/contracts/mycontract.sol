// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Splitwise {
    // Structure representing a debt
    struct Debt {
        uint32 amount;
        bool exists;

    }

 mapping(address => mapping(address => Debt)) public debts;
    mapping(address => uint256) public lastActive;

    event IOUAdded(address indexed debtor, address indexed creditor, uint32 amount);

    function lookup(address debtor, address creditor) public view returns (uint32 ret) {
        return debts[debtor][creditor].amount;
    }

    function add_IOU(address creditor, uint32 amount, address[] memory cycle) public {
        require(creditor != msg.sender, "You cannot owe yourself");

        debts[msg.sender][creditor].amount += amount;
        debts[msg.sender][creditor].exists = true;
        lastActive[msg.sender] = block.timestamp;
        lastActive[creditor] = block.timestamp;

        emit IOUAdded(msg.sender, creditor, amount);

        // Resolve cycles
        if (cycle.length > 0) {
            resolveCycle(cycle);
        }
    }

    function resolveCycle(address[] memory cycle) internal {
        uint32 minDebt = debts[cycle[cycle.length - 1]][cycle[0]].amount;

        for (uint256 i = 0; i < cycle.length - 1; i++) {
            uint32 debt = debts[cycle[i]][cycle[i + 1]].amount;
            if (debt < minDebt) {
                minDebt = debt;
            }
        }

        for (uint256 i = 0; i < cycle.length - 1; i++) {
            debts[cycle[i]][cycle[i + 1]].amount -= minDebt;
            if (debts[cycle[i]][cycle[i + 1]].amount == 0) {
                debts[cycle[i]][cycle[i + 1]].exists = false;
            }
        }

        debts[cycle[cycle.length - 1]][cycle[0]].amount -= minDebt;
        if (debts[cycle[cycle.length - 1]][cycle[0]].amount == 0) {
            debts[cycle[cycle.length - 1]][cycle[0]].exists = false;
        }
    }

}
