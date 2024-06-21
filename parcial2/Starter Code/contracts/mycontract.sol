// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

contract SplitWise {
    mapping(address => mapping(address => uint32)) private debts;
    mapping(address => bool) private visited;

    function add_IOU(address creditor, uint32 amount) public {
        require(amount > 0, "Amount must be positive");
        require(!hasCycle(msg.sender, creditor), "Cycle detected");
        debts[msg.sender][creditor] += amount;
        emit IOUAdded(msg.sender, creditor, amount);
    }

    function hasCycle(address debtor, address creditor) private returns (bool) {
        if (visited[debtor]) {
            return false;
        }
        visited[debtor] = true;

        address[] memory creditors = getCreditors(debtor);
        for (uint256 i = 0; i < creditors.length; i++) {
            address nextCreditor = creditors[i];
            if (nextCreditor == creditor || hasCycle(nextCreditor, creditor)) {
                return true;
            }
        }

        visited[debtor] = false;
        return false;
    }

function getCreditors(address debtor) public view returns (address[] memory) {
    address[] memory creditors = new address.v;
    uint256 numCreditors = 0;
    for (uint256 i = 0; i < getAllPossibleAddresses().length; i++) {
        address possibleCreditor = getAllPossibleAddresses()[i];
        if (debts[debtor][possibleCreditor] > 0) {
            creditors[numCreditors] = possibleCreditor;
            numCreditors++;
        }
    }
    address[] memory result = new address;
    for (uint256 i = 0; i < numCreditors; i++) {
        result[i] = creditors[i];
    }
    return result;
}



    function getAllPossibleAddresses() private pure returns (address[] memory) {
        address[] memory addresses = new address;
        addresses[0] = address(0x123);
        addresses[1] = address(0x456);
        addresses[2] = address(0x789);
        return addresses;
    }

    event IOUAdded(
        address indexed debtor,
        address indexed creditor,
        uint32 amount
    );
}
