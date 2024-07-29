from arbolMerkle import ArbolDeMerkle, Nodo
import random

def imprimirArbol(arbol):
    if arbol.niveles:
        print("Estructura del arbol:")
        raiz = arbol.niveles[0][0]
        print(f"Hash: {raiz.hash}")
        print(f"izq: {raiz.dato.split(', ')[0]}")
        print(f"der: {raiz.dato.split(', ')[1]}")
        imprimirNodo(raiz.izq, "")
        imprimirNodo(raiz.der, "")


def imprimirNodo(Nodo, indexado=""):
    if Nodo is None:
        return
    rama = "    "
    nuevoIndexado = indexado + ("    ")
    tabulado = indexado+rama
    print(tabulado+"Hash: "+Nodo.hash)
    if ',' in Nodo.dato:
        print(tabulado+"izq: "+Nodo.dato.split(',')[0])
        print(tabulado+"der: "+Nodo.dato.split(',')[1])
    else:
        print(tabulado+"hoja: "+Nodo.dato)
    hijos = []
    if Nodo.izq:
        hijos.append(Nodo.izq)
    if Nodo.der:
        hijos.append(Nodo.der)

    for i, hijo in enumerate(hijos):
        imprimirNodo(hijo, nuevoIndexado)

def agregarNodosAlArbol(arbol, arr):
    for dato in arr:
        print(f"Agregando Nodo con dato: {dato}")
        arbol.add_node(dato)
    imprimirArbol(arbol)
    raiz = arbol.get_merkle_root()
    print(f"\nRaiz del arbol: {raiz}")
    return raiz

def verificarNodos(arbol, arr, raiz):
    for d in arr:
        try:
            nodoDePrueba = Nodo(d)
            proof = arbol.getMerkleProof(nodoDePrueba.dato)
            arbol.imprimirProof(proof)
            print(f"El resultado de verificar el nodo '{nodoDePrueba.dato}' es: {arbol.verifyMerkleProof(proof, nodoDePrueba.hash, raiz)}\n")
        except ValueError as e:
            print(f"\nEl resultado de verificar el nodo '{d}' es: {e}\n")

if __name__ == "__main__":
    arbol = ArbolDeMerkle()

    # Datos de prueba
    test = ["arbol", "de", "merkle", "hash", "nodo", "hijo", "padre", "main"]

    # Agregar nodos al arbol
    raiz = agregarNodosAlArbol(arbol, test)

    # Agregar claves que no existen en el arbol
    test.append("validacion1")
    test.append("validacion2")
    random.shuffle(test)

    # Verificacion de nodos con los datos que existen y no existen en el arbol
    verificarNodos(arbol, test, raiz)
