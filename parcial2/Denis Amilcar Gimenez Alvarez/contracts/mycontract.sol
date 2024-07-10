// SPDX-License-Identifier: UNLICENSED

// DO NOT MODIFY BELOW THIS
pragma solidity ^0.8.0;

contract Splitwise {
    // Realiza un mapeo de deudas: deudor -> acreedor -> monto de la deuda
    mapping(address => mapping(address => uint32)) public debts;

    // Función lookup para consultar la deuda entre deudor y acreedor
    function lookup(address debtor, address creditor) public view returns (uint32) {
        return debts[debtor][creditor];
    }

    // Función add_IOU para agregar una deuda
    function add_IOU(address creditor, uint32 amount) public {
        require(amount > 0, "El monto debe ser positivo");
        address debtor = msg.sender;

        // Agrega la deuda
        debts[debtor][creditor] += amount;
    }

    // Función para reducir una deuda específica
    function reduceDebt(address debtor, address creditor, uint32 amount) public {
        require(debts[debtor][creditor] >= amount, "Amount exceeds debt");
        debts[debtor][creditor] -= amount;
    }
}
