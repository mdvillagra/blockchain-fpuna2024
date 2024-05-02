# Implementación de Árbol de Merkle

Esta es una implementación en Java de un Árbol de Merkle, una estructura de datos fundamental utilizada en aplicaciones criptográficas como la tecnología blockchain. El Árbol de Merkle proporciona una forma eficiente de verificar la integridad y consistencia de conjuntos de datos grandes representándolos en una estructura de árbol compacta basada en hashes.

## Bibliotecas Utilizadas

- [PoseidonHash](https://github.com/loopring/poseidon-java): Este proyecto utiliza la biblioteca PoseidonHash para el hash criptográfico. PoseidonHash es una biblioteca ligera de Java que proporciona implementaciones eficientes de la función de hash Poseidon, que se utiliza comúnmente en aplicaciones de blockchain y criptográficas.

## Descripción del Proyecto

- `MerkleTree.java`: Esta clase contiene la implementación de la estructura de datos del Árbol de Merkle, incluyendo métodos para la creación del árbol, generación de pruebas, verificación de pruebas y hashing utilizando la función de hash Poseidon.
- `Main.java`: Esta clase sirve como punto de entrada para la aplicación. Demuestra cómo utilizar la clase `MerkleTree` para crear un árbol de Merkle, generar pruebas y verificarlas.

## Instrucciones

Para ejecutar el proyecto, sigue estos pasos:

1. Asegúrate de tener Java instalado en tu sistema.
2. Clona este repositorio en tu máquina local.
3. Abre el proyecto en tu IDE de Java favorito.
4. Compila y ejecuta el archivo `Main.java`.

## Observaciones

- La implementación del Árbol de Merkle en este proyecto está diseñada con fines educativos y puede que no sea adecuada para su uso en producción sin optimización adicional y auditoría de seguridad.
- La biblioteca PoseidonHash proporciona funcionalidad de hashing eficiente, pero es esencial utilizarla correctamente y de manera segura en aplicaciones del mundo real.
