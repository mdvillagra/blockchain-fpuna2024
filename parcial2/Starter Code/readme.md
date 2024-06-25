### Descripción del Proyecto

El proyecto Splitwise está diseñado para facilitar la gestión descentralizada de deudas entre múltiples usuarios mediante contratos inteligentes en la cadena de bloques. Utilizando la tecnología Ethereum y la biblioteca ethers.js, Splitwise permite a los usuarios realizar y gestionar transacciones de deuda de manera segura y eficiente. 

#### Cambios Implementados

- Se añadieron las funciones `getUsers`, `add_IOU`, `getLastActive`, y `getTotalOwed` en el cliente de Splitwise.
- Implementación híbrida para la resolución de ciclos de deuda: la detección de ciclos se realiza en el cliente, mientras que la resolución final se efectúa en el contrato usando la función interna `resolveCycle`.

#### Detalles Técnicos

- **Función `resolveCycle` en el Contrato:**

  La función `resolveCycle` es crucial para mantener la integridad de los registros de deuda en el contrato Splitwise. Esta función se encarga de resolver los ciclos de deuda detectados previamente en el cliente. Aquí está cómo funciona:

  - **Detección de Ciclos:** Antes de llamar a `resolveCycle`, el cliente detecta ciclos de deuda entre usuarios. Un ciclo se representa como una lista de direcciones de usuarios donde cada usuario debe al siguiente en la lista.

  - **Resolución de Deudas:** Una vez que se identifica un ciclo, `resolveCycle` procede a calcular el monto mínimo de deuda dentro del ciclo. Luego, ajusta las deudas correspondientes para eliminar este monto mínimo de todas las relaciones de deuda dentro del ciclo.

  - **Actualización de Registros:** Después de la resolución, `resolveCycle` actualiza las estructuras de datos en el contrato para reflejar las nuevas cantidades de deuda entre los usuarios implicados, asegurando que todas las deudas pendientes sean precisas y consistentes.

