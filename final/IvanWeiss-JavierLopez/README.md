# blockchain-primer-final
### Integrantes del grupo:
- Iván Weiss Van Der Pol 5.897.596
- Javier Rafael López Cáceres 4.552.477
## Programas necesarios
Para poder ejecutar correctamente el proyecto debe tener instalado

[Visual Studio Code](https://code.visualstudio.com/)

[Live Server (extensión de Visual studio code)](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 

## Instalación
Para poder levantar el proyecto correctamente debe ejecutar estos 3 comandos 
```
1. npm install --save-dev hardhat
2. npm install --save-dev @nomiclabs/hardhat-ethers ethers
3. npm install --save-dev @openzeppelin/contracts
```

## Ejecución

Luego de haber instalado las dependencias puede proceder a ejecutar el siguiente comando en una consola independiente:
```
npx hardhat node
```

En otra consola, luego de haber ejecutado el comando anterior, puede proceder a ejecutar el comando
```
npx hardhat run --network localhost scripts/deploy_all.js
```
Este comando se encarga de ejecutar los deploys independientes, los address de cada contrato y ponerlos en el exchange.js para mayor facilidad

Active el Live server de Visual Studio Code mediante el botón **Go Live** que se encuentra en la esquina inferior derecha de VScode

![image](https://github.com/user-attachments/assets/2e3aac43-19a0-4081-9efc-f1fcf09c533d)

Una vez iniciado el *Go Live*, presione click derecho sobre el index.html y seleccione la opción **Open with live server**

![image](https://github.com/user-attachments/assets/5a0ca4ea-5119-4696-aa15-d5f039b46b68)

Al realizar todos estos pasos se encontrará con la vista principal del proyecto.

![image](https://github.com/user-attachments/assets/d102d051-2e44-415b-a750-1ab5e50226f8)

## Observaciones

El proyecto tiene habilitado el sanity Check por defecto, esto hará que se presenten posibles inconvenientes en las pruebas manuales, en caso de que quiera realizar pruebas manuales puede comentar la linea 905 del Exchange.js.

![image](https://github.com/user-attachments/assets/b606e8a6-81de-4beb-a3c1-83e200717eb9)

Al comentar esta linea, el sanity check quedará deshabilitado por lo que podrá realizar pruebas manuales con normalidad.
