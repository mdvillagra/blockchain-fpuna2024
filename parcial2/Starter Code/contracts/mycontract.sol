// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Splitwise {
    // Estructura que representa una deuda
    struct Debt {
        uint32 amount; // Monto de la deuda entre dos partes
        bool exists;   // Indicador de si la deuda existe
    }

    // Mapeo para almacenar las deudas entre dos direcciones
    mapping(address => mapping(address => Debt)) public debts;

    // Mapeo para rastrear la marca de tiempo de la última actividad de cada dirección
    mapping(address => uint256) public lastActive;

    // Evento emitido cuando se añade un nuevo IOU (I Owe You)
    event IOUAdded(address indexed debtor, address indexed creditor, uint32 amount);

    // Función para obtener el monto de la deuda entre dos direcciones
    function lookup(address debtor, address creditor) public view returns (uint32 ret) {
        return debts[debtor][creditor].amount;
    }

    // Función para agregar un IOU desde msg.sender a un acreedor especificado
    // También resuelve cualquier ciclo en el gráfico de deudas
    function add_IOU(address creditor, uint32 amount, address[] memory cycle) public {
        require(creditor != msg.sender, "No puedes deberte a ti mismo");

        // Aumentar el monto de la deuda de msg.sender hacia el acreedor
        debts[msg.sender][creditor].amount += amount;

        // Marcar la deuda como existente
        debts[msg.sender][creditor].exists = true;

        // Actualizar la marca de tiempo de última actividad para ambas partes
        lastActive[msg.sender] = block.timestamp;
        lastActive[creditor] = block.timestamp;

        // Emitir un evento indicando que se ha añadido un IOU
        emit IOUAdded(msg.sender, creditor, amount);

        // Resolver ciclos en el gráfico de deudas si se detecta alguno
        if (cycle.length > 0) {
            resolveCycle(cycle);
        }
    }

    // Función para resolver ciclos en el gráfico de deudas
    function resolveCycle(address[] memory cycle) internal {
        // Inicializar minDebt con el monto desde el último nodo hasta el primer nodo en el ciclo
        uint32 minDebt = debts[cycle[cycle.length - 1]][cycle[0]].amount;

        // Encontrar el monto mínimo de deuda en el ciclo
        for (uint256 i = 0; i < cycle.length - 1; i++) {
            uint32 debt = debts[cycle[i]][cycle[i + 1]].amount;
            if (debt < minDebt) {
                minDebt = debt;
            }
        }

        // Reducir el monto de deuda en minDebt para cada borde en el ciclo
        for (uint256 i = 0; i < cycle.length - 1; i++) {
            debts[cycle[i]][cycle[i + 1]].amount -= minDebt;

            // Si el monto de la deuda se vuelve cero, marcar la deuda como no existente
            if (debts[cycle[i]][cycle[i + 1]].amount == 0) {
                debts[cycle[i]][cycle[i + 1]].exists = false;
            }
        }

        // También reducir el monto de deuda para el último borde en el ciclo
        debts[cycle[cycle.length - 1]][cycle[0]].amount -= minDebt;

        // Si el monto de la deuda se vuelve cero, marcar la deuda como no existente
        if (debts[cycle[cycle.length - 1]][cycle[0]].amount == 0) {
            debts[cycle[cycle.length - 1]][cycle[0]].exists = false;
        }
    }
}
