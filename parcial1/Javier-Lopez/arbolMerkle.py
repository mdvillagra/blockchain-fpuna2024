import hashlib

def hash_sha256(input_str):
    return hashlib.sha256(input_str.encode()).hexdigest()

class Nodo:
    def __init__(self, dato, izq=None, der=None):
        self.hash = hash_sha256(dato)
        self.izq = izq
        self.der = der
        self.dato = dato

class ArbolDeMerkle:
    def __init__(self):
        self.hojas = []
        self.niveles = []


    def add_node(self, dato):
        self.hojas.append(Nodo(dato))
        self.createTree()
        
    def get_merkle_root(self):
        return self.niveles[0][0].hash if self.niveles else None


    def createTree(self):
        niveles = [self.hojas]
        indiceNivel = 0
        while len(niveles[0]) > 1:
            nivelActual = niveles[0]
            siguiente = []
            for i in range(0, len(nivelActual), 2):
                izq = nivelActual[i]
                der = nivelActual[i + 1] if i + 1 < len(nivelActual) else izq
                hash = izq.hash + ", " + der.hash
                padre = Nodo(hash, izq, der)
                siguiente.append(padre)
            
            niveles.insert(0, siguiente)
            indiceNivel += 1
        
        self.niveles = niveles


    def imprimirProof(self, proof ):
        try:
            print("Merkle Proof")
            for Nodo, posicion, nivel in proof:
                print(f"  Nivel {nivel}: {posicion.title()} hermano con hash {Nodo.hash}")
        except ValueError as e:
            print(e)



    def getMerkleProof(self, m):
        proof = []
        indiceHoja = None
        print(f"Buscando dato: {m}")
        for i, Nodo in enumerate(self.hojas):
            if Nodo.dato == m:
                indiceHoja = i
                print(f"Dato encontrado en la hoja de indice {indiceHoja}")
                break

        if indiceHoja is None:
            raise ValueError("El dato de la hoja proporcionada no ha sido encontrado en el arbol")

        for nivel in range(len(self.niveles) - 1, 0, -1):
            nodoDer = indiceHoja % 2
            indiceHermano = indiceHoja + 1 if not nodoDer else indiceHoja - 1
            if indiceHermano < len(self.niveles[nivel]):
                nodoHermano = self.niveles[nivel][indiceHermano]
                posicion = 'der' if nodoDer else 'izq'
                proof.append((nodoHermano, posicion, nivel - 1))
            indiceHoja //= 2 

        return proof



    def verifyMerkleProof(self, proof, target_hash, root_hash):
        for Nodo, posicion, _ in proof:
            if posicion == 'izq':
                hash = target_hash + ", " + Nodo.hash
            elif posicion == 'der':
                hash = Nodo.hash + ", " + target_hash
            else:
                raise ValueError("Posición de Nodo no válida en prueba; debe ser 'izq' o 'der'.")
            target_hash = hash_sha256(hash)
        return target_hash == root_hash



