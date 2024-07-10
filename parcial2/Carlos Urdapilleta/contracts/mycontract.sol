// SPDX-License-Identifier: UNLICENSED

// DO NOT MODIFY BELOW THIS
pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract Splitwise {
// DO NOT MODIFY ABOVE THIS

// ADD YOUR CONTRACT CODE BELOW
	struct Records {
        address creditor;
        uint32 amount;
    }

	mapping(address => Records[]) addressRecords;
	mapping(address => uint256) private timestamps;
	address[] allAddresses;

	function lookup(address debtor, address creditor) public view returns (uint32 amount) {
		Records[] memory records = addressRecords[debtor];
		for (uint i = 0; i < records.length; i++) {
			if (records[i].creditor == creditor) {
				return records[i].amount;
			}
		}
		return 0;
	}

	function add_IOU(address creditor, uint32 amount) public {
		address debtor = address(msg.sender);
		require(debtor != creditor, "Can't owe money to yourself");
		require(amount > 0, "Amount should be a positive number");
		// sender es nuevo
		if (timestamps[debtor] == 0)
			allAddresses.push(debtor);
		// to es nuevo
		if (timestamps[creditor] == 0)
			allAddresses.push(creditor);
		// actualizar deuda existente
		Records[] storage records = addressRecords[debtor];
		bool exists = false;
		for (uint i = 0; i < records.length; i++) {
			if (records[i].creditor == creditor) {
				records[i].amount += amount;
				exists = true;
			}
		}
		if (!exists) {
			Records memory record = Records(creditor, amount);
			addressRecords[debtor].push(record);
		}
		timestamps[debtor] = block.timestamp;
		timestamps[creditor] = block.timestamp;
	}

	function deleteLoops(address[] memory list, uint32 amount) public {
		for (uint i = 0; i < list.length - 1; i++) {
			address from = list[i];
			address to = list[i + 1];
			// actualizamos timestamp de los miembros del bucle
			timestamps[from] = block.timestamp;
			timestamps[to] = block.timestamp;
			Records[] storage records = addressRecords[from];
			for (uint j = 0; j < records.length; j++) {
				// solo restamos al to
				if (records[j].creditor == to) {
					records[j].amount -= amount;
					break;
				}
			}
		}
	}

	function getTotalOwed(address debtor) public view returns (Records[] memory) {
		return addressRecords[debtor];
	}

	function getTimestamp(address user) public view returns (uint256) {
		return timestamps[user];
	}

	function getAllAddresses() public view returns (address[] memory) {
        return allAddresses;
    }
}
