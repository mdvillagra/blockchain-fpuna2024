// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.26;

contract Splitwise {
    struct Deuda {
        address acreedor;
        uint monto;
    }
    mapping(address => mapping(address => uint)) mapBalances;
    mapping(address => address[]) mapListaAcreedores;
    address[] participantesActivos;
    mapping(address => uint) mapActivdad;

    function addressExisteEnLista(address[] memory lista, address user)
        public
        pure
        returns (bool)
        {
            uint len = lista.length;
            bool res = false;

            for (uint i=0; i < len; i++) {
                if (lista[i] == user) {
                    res = true;
                }
            }

            return res;
        }

    function add_IOU(address acreedor, uint monto, address deudor)
        public
        {
            mapBalances[deudor][acreedor] += monto;
            mapActivdad[deudor] = block.timestamp;
            address[] storage acreedores = mapListaAcreedores[deudor];
            bool existeAcreedor = addressExisteEnLista(acreedores, deudor);

            if (existeAcreedor == false) {
                acreedores.push(acreedor);
            }

            if (addressExisteEnLista(participantesActivos, deudor) == false) {
                participantesActivos.push(deudor);
            }

            if (addressExisteEnLista(participantesActivos, acreedor) == false) {
                participantesActivos.push(acreedor);
            }
        }

    function getTotalOwed(address deudor)
        public
        view
        returns (uint)
        {
            uint len = mapListaAcreedores[deudor].length;
            address[] storage acreedores = mapListaAcreedores[deudor];
            uint total;

            for (uint i=0; i < len; i++) {
                total += mapBalances[deudor][acreedores[i]];
            }
            
            return total;
        }

    function getLastActive(address user)
        public
        view
        returns (uint)
        {
            return mapActivdad[user];
        }

    function getUsers()
        public
        view
        returns (address[] memory)
        {
            return participantesActivos;
        }
}