// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.26;

import "hardhat/console.sol";

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
            //Verificar ciclos
            // deudor : c
            // acreedor : a
            mapping (address => uint) storage deudasDelAcreedor = mapBalances[acreedor]; // a : { b : 1, x : 1 }
            address[] storage acreedoresDelAcreedor = mapListaAcreedores[acreedor];
            uint menorDeuda = monto;
            console.log("El deudor ", deudor);
            console.log("El acreedor ", acreedor);

            mapBalances[deudor][acreedor] += monto;
            console.log("Se sumo ", monto, " a ", deudor);
            address[] storage acreedoresDeudor = mapListaAcreedores[deudor];
            bool existeAcreedor = addressExisteEnLista(acreedoresDeudor, acreedor);

            if (existeAcreedor == false) {
                acreedoresDeudor.push(acreedor);
            }

            if (addressExisteEnLista(participantesActivos, deudor) == false) {
                participantesActivos.push(deudor);
            }

            if (addressExisteEnLista(participantesActivos, acreedor) == false) {
                participantesActivos.push(acreedor);
            }

            for (uint i=0; i < acreedoresDelAcreedor.length; i++) {
                address acreedorDelAcreedor = acreedoresDelAcreedor[i];
                console.log(" Deba a: ", acreedorDelAcreedor, deudasDelAcreedor[acreedorDelAcreedor], " $");
                if (menorDeuda > deudasDelAcreedor[acreedorDelAcreedor]) {
                    menorDeuda = deudasDelAcreedor[acreedorDelAcreedor];
                }
                mapping(address => uint) // b : { c : 1 }
                    storage
                    deudasDelAcreedorDelAcreedor 
                    = mapBalances[acreedorDelAcreedor];
                
                uint deudaDelAcreedorEnCicloAlDeudor = deudasDelAcreedorDelAcreedor[deudor];
                if (deudaDelAcreedorEnCicloAlDeudor > 0) {
                    if (menorDeuda > deudaDelAcreedorEnCicloAlDeudor) {
                        menorDeuda = deudaDelAcreedorEnCicloAlDeudor;
                    }
                    console.log("CLICLOOOO...!!!!");
                    console.log(acreedor);
                    console.log(" Debe a ");
                    console.log(acreedorDelAcreedor, deudasDelAcreedor[acreedorDelAcreedor], " $");
                    console.log(" que debe a ");
                    console.log(deudor, deudaDelAcreedorEnCicloAlDeudor, " $");

                    deudasDelAcreedorDelAcreedor[deudor] -= menorDeuda;
                    deudasDelAcreedor[acreedorDelAcreedor] -= menorDeuda;
                    mapBalances[deudor][acreedor] -= menorDeuda;
                }
            }
            mapActivdad[deudor] = block.timestamp;
        }

    function getTotalOwed(address deudor)
        public
        view
        returns (uint)
        {
            uint len = mapListaAcreedores[deudor].length;
            address[] storage acreedores = mapListaAcreedores[deudor];
            uint total;
            console.log("Acreedores de: ", deudor);

            for (uint i=0; i < len; i++) {
                console.log(acreedores[i], "Se le debe: ", mapBalances[deudor][acreedores[i]], "$");
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

    function lookup(address deudor, address acreedor)
        public
        view
        returns (uint)
        {
            console.log(deudor);
            console.log(acreedor);
            return mapBalances[deudor][acreedor];
        }

    function getUsers()
        public
        view
        returns (address[] memory)
        {
            return participantesActivos;
        }
}