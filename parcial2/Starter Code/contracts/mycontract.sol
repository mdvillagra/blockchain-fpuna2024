// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Splitwise {
    // Estructura para almacenar la deuda entre dos direcciones
    struct Debt {
        uint32 amount;
    }

    // Mapeo de deudor a acreedor y su deuda correspondiente
    mapping(address => mapping(address => Debt)) public debts;

    // Evento para registrar la adición de una deuda
    event IOUAdded(address indexed debtor, address indexed creditor, uint32 amount);

    // Función para consultar la deuda entre dos direcciones
    function lookup(address debtor, address creditor) public view returns (uint32) {
        return debts[debtor][creditor].amount;
    }

    // Función para añadir una cantidad a la deuda
    function add_IOU(address creditor, uint32 amount) public {
        require(amount > 0, "El monto debe ser positivo");
        debts[msg.sender][creditor].amount += amount;

        // Verificar si se forma un ciclo
        if (debts[creditor][msg.sender].amount > 0) {
            uint32 minDebt = min(debts[msg.sender][creditor].amount, debts[creditor][msg.sender].amount);
            debts[msg.sender][creditor].amount -= minDebt;
            debts[creditor][msg.sender].amount -= minDebt;
        }

        // Emitir el evento IOUAdded
        emit IOUAdded(msg.sender, creditor, amount);
    }

    // Función auxiliar para encontrar el mínimo entre dos números
    function min(uint32 a, uint32 b) internal pure returns (uint32) {
        return a < b ? a : b;
    }
}
