import poseidon_hash_main.poseidon as poseidon
import math
import sys


def main():
    global poseidon_instance
    if len(sys.argv) == 2 and sys.argv[1] == "slow":
        poseidon_instance = poseidon.Poseidon(poseidon.parameters.prime_255, 128, 5, 8, 132)
    else:
        poseidon_instance, _ = poseidon.parameters.case_simple()
    messages = ["Data 1", "Data 2", "Data 3", "Data 4", "Data 5"]
    # create_tree
    print("\nCreando arbol")
    root = create_tree(messages)
    print_recursive(root, 0)
    # get_merkle_proof
    print("\nObteniendo prueba de Merkle para \"Data 1\"")
    proof = get_merkle_proof(root, "Data 1")
    print(proof)
    # buscar proof para un mensaje que no existe
    print("Caso invalido, Data 100")
    print(get_merkle_proof(root, "Data 100"))
    # verify_merkle_proof
    print("\nVerificando prueba de Merkle")
    print(verify_merkle_proof(root, proof, poseidon_hash("Data 1")))
    # buscar otro mensaje con el mismo proof, invalido
    print("Caso invalido, otro dato con mismo proof")
    print(verify_merkle_proof(root, proof, poseidon_hash("Data 2")))
    # modificar el proof para que no sea valido
    proof[0] = proof[0][:4] + '' + proof[0][5:]
    print("Caso invalido, mismo dato con proof modificado")
    print(verify_merkle_proof(root, proof, poseidon_hash("Data 1")))


def create_tree(messages):
    children = []
    height = math.ceil(math.log2(len(messages)))
    # rellenar con vacio la lista de mensajes
    for _ in range(len(messages), 2 ** height):
        messages.append("")
    # se crean nodos hoja con el hash de los mensajes
    for message in messages:
        poseidon_digest = poseidon_hash(message)
        children.append(Node(poseidon_digest))
    # por cada nivel se crean nodos con el hash de los nodos hijos
    for _ in range(height):
        parents = []
        for j in range(0, len(children), 2):
            data = poseidon_hash(children[j].data + children[j + 1].data)
            node = Node(data)
            node.left = children[j]
            node.right = children[j + 1]
            node.left.is_left = True
            parents.append(node)
        children = parents
    return children[0]


def print_recursive(node, level):
    if node is not None:
        if level == 0:
            print(node.data)
        else:
            print(" " * 4 * level + node.data + "-" + ("IZQ" if node.is_left else "DER"))
        print_recursive(node.left, level + 1)
        print_recursive(node.right, level + 1)


def get_merkle_proof(root, message):
    target = poseidon_hash(message)
    found, proof = get_merkle_proof_recursive(root, target)
    if not found:
        return "No se encontro el mensaje"
    return proof


def get_merkle_proof_recursive(node, target):
    if node is None:
        return False, []
    if node.data == target:
        return True, []
    for child in (node.left, node.right):
        found, proof = get_merkle_proof_recursive(child, target)
        if found:
            sibling = node.right if child == node.left else node.left
            proof.append(sibling.data + "-" + ("IZQ" if sibling.is_left else "DER"))
            return True, proof
    return False, []


def verify_merkle_proof(root, proof, target):
    for sibling in proof:
        hashed, direction = sibling.split("-")
        if direction == "IZQ":
            target = poseidon_hash(hashed + target)
        else:
            target = poseidon_hash(target + hashed)
    return 1 if root.data == target else 0


def poseidon_hash(message):
    message_list = []
    for char in message:
        message_list.append(ord(char))
    return hex(int(poseidon_instance.run_hash(message_list)))


class Node:
    def __init__(self, data=None):
        self.data: str = data
        self.left: Node | None = None
        self.right: Node | None = None
        # no se agrega al hash final
        self.is_left: bool = False


if __name__ == "__main__":
    global poseidon_instance
    main()
