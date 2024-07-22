Carlos Urdapilleta

# Instalar dependencias
```
npm install
```
# Levantar servidor
```
npx hardhat node
```
En otra terminal
```
npx hardhat run --network localhost scripts/deploy_token.js
```
Actualizar "tokenAddr" en 'contracts/exchange.sol' y "token_address" en 'web_app/exchange.js'
```
npx hardhat run --network localhost scripts/deploy_exchange.js
```
Actualizar "token_contract" en 'web_app/exchange.js'

Abrir web_app/index.html
