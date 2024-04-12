## Pasos para ejecutar el código
1. Descargar el repositorio
2. Cargar las dependencias con maven (mvn clean install)
3. Ejecutar la clase Main con cualquier IDE (preferentemente IntelliJ IDEA)

### Nota
Para cambiar los parámetros, se puede hacer directamente cambiando los datos dentro del archivo Main.

## Pruebas
### Prueba 1
#### Arbol de merkle con los datos: prueba1, prueba2, prueba3, prueba4, prueba5
```
Árbol creado (sólo se muestran los últimos 5 dígitos para mejor visualización): 
 ── raíz, hash: bfc0a
    ├── izquierdo, hash: db842
    │   ├── izquierdo, hash: d819c
    │   │   ├── izquierdo, hash: 7b132
    │   │   └── derecho, hash: 22d84
    │   └── derecho, hash: 31c04
    │       ├── izquierdo, hash: 6ffcb
    │       └── derecho, hash: 342c8
    └── derecho, hash: e69e2
        ├── derecho, hash: 8c234
        │   ├── derecho, hash: 3334e
        │   └── derecho, hash: 3334e
        └── derecho, hash: 8c234
            ├── derecho, hash: 3334e
            └── derecho, hash: 3334e

Buscando el nodo hoja que contiene el valor objetivo: prueba3
Hash objetivo: 21e0b0f3f0f0ed222d5535a5a81eeb8f882bfec772a5826b20e1804f4436ffcb
Prueba de Merkle: 
 ── raíz, hash: 342c8
    └── izquierdo, hash: d819c
        └── derecho, hash: e69e2

Verificación de Merkle para el hash 21e0b0f3f0f0ed222d5535a5a81eeb8f882bfec772a5826b20e1804f4436ffcb: 1

Process finished with exit code 0

```

#### Arbol de merkle con los datos: "marea susurrante","camino oculto","estrella fugaz","luz de luciérnagas","suspiro de la luna","eco del pasado","susurro del viento","melodía olvidada"
En este caso, no puede crear un proof debido a que el dato "prueba3" no existe en el árbol, por lo que termina con status 2.
```
Árbol creado (sólo se muestran los últimos 5 dígitos para mejor visualización): 
 ── raíz, hash: 6ce6b
    ├── izquierdo, hash: 76e91
    │   ├── izquierdo, hash: d3b4e
    │   │   ├── izquierdo, hash: 8ae84
    │   │   └── derecho, hash: 8f6d5
    │   └── derecho, hash: ae5e1
    │       ├── izquierdo, hash: 4f98c
    │       └── derecho, hash: c02c7
    └── derecho, hash: 065ed
        ├── izquierdo, hash: 260e0
        │   ├── izquierdo, hash: e74b7
        │   └── derecho, hash: 06a45
        └── derecho, hash: 84ef7
            ├── izquierdo, hash: 34479
            └── derecho, hash: d96c1

Buscando el nodo hoja que contiene el valor objetivo: prueba 3
Hash objetivo: 2bacf789cf00d24db838bb5bf1a9a7e12d5360bf943f4ca1787fd021bb76f392

Process finished with exit code 2
```
Otro caso donde el dato sí existe, pero el proof no pertenece a dicho dato para la función verifyMerkle:
``````
Árbol creado (sólo se muestran los últimos 5 dígitos para mejor visualización): 
 ── raíz, hash: 6ce6b
    ├── izquierdo, hash: 76e91
    │   ├── izquierdo, hash: d3b4e
    │   │   ├── izquierdo, hash: 8ae84
    │   │   └── derecho, hash: 8f6d5
    │   └── derecho, hash: ae5e1
    │       ├── izquierdo, hash: 4f98c
    │       └── derecho, hash: c02c7
    └── derecho, hash: 065ed
        ├── izquierdo, hash: 260e0
        │   ├── izquierdo, hash: e74b7
        │   └── derecho, hash: 06a45
        └── derecho, hash: 84ef7
            ├── izquierdo, hash: 34479
            └── derecho, hash: d96c1

Buscando el nodo hoja que contiene el valor objetivo: suspiro de la luna
Hash objetivo: 27f7e273919d2a4ed33eb640365fccd654a95ee76f721ed56c85a6a7b6de74b7
Prueba de Merkle: 
 ── raíz, hash: 06a45
    └── derecho, hash: 84ef7
        └── izquierdo, hash: 76e91

Verificación de Merkle para el hash 21e0b0f3f0f0ed222d5535a5a81eeb8f882bfec772a5826b20e1804f4436ffcb: 0

Process finished with exit code 0