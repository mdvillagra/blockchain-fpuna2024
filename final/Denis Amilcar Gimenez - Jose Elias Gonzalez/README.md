Alumnos:
Denis Amilcar Giménez Alvarez. CI 5.415.807
Jose Elias Gonzalez Valdez. CI 5.456.651

---
# Levantar el proyecto
Se puede levantar el proyecto directamente en una máquina local tal como se especificó en el enunciado del trabajo práctico.
De forma alternativa, se puede levantar con docker, el mismo ya prepara hardhat y sus dependencias, debiendo solamente levantar el hardhat desde una terminal en el contenedor estando en la ruta "/usr/src/app" con el comando:
```
npx hardhat node
```

Luego abrir otra terminal dentro del contenedor y levantar primero el contrato del token con:
```
npx hardhat run --network localhost scripts/deploy_token.js
```

y posteriormente levantar el contrato del exchange:
```
npx hardhat run --network localhost scripts/deploy_exchange.js
```

Con estos pasos ya se puede abrir el archivo index.html desde la pc local.