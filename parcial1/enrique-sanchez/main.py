import copy
import random
import sys

import merkle_tree


def main(transactions, example_number, success_flag):
    print(example_number)
    transactions_copy = copy.copy(transactions)
    m_tree = merkle_tree.MerkleTree(transactions)  # Crea el arbol - función createTree(M)

    print("Merkle Tree:")
    m_tree.print_tree()

    print("\nRoot Hash:", m_tree.get_root())

    # Elegimos la transacción a probar de manera aleatoria
    transaction_to_prove = transactions_copy[random.randint(0, len(transactions_copy) - 1)] if success_flag else 123456789

    # Retorna el camino del proof de la transacción. Si esta no se encuentra en el arbol, se retorna una lista vacía.
    # También retorna qué dirección tomar para facilitar la verificación en el merkle proof verification.
    # Función getMerkleProof(T, m)
    proof, sibling = m_tree.get_merkle_proof(transaction_to_prove)
    print("\nProof for", transaction_to_prove, ":", proof)

    # Función verifyMerkleProof(root, p). Recibe la transacción a probar y la prueba. Luego, compara el root del arbol
    # junto con el root computado resultado del hash de la transacción a probar y el camino del proof.
    is_valid_proof = m_tree.verify_merkle_proof(transaction_to_prove, proof)
    print(f"Proof is: {is_valid_proof} \n")
    print("-------------------------------------------")

    return 0


if __name__ == '__main__':
    example_transactions_one = [564738291028305, 983465712893749, 234567890123456, 987654321098765, 98765432109234]
    example_transactions_two = [982347832748902,
                                129384729038472,
                                893274892374987,
                                438957438597438,
                                894389574389573,
                                235892375892375,
                                987234987239487,
                                458924895748923]
    example_transactions_three = [982347832748902,
                                  129384729038472,
                                  893274892374987,
                                  438957438597438,
                                  894389574389573,
                                  235892375892375,
                                  987234987239487,
                                  458924895748923]
    example_transactions_four = [123, 456, 789]

    main(example_transactions_one, 'Example one', True)
    main(example_transactions_two, 'Example two', True)
    main(example_transactions_three, 'Example three - Transaction not in Merkle Tree', False)
    main(example_transactions_four, 'Example four - Transaction not in Merkle Tree', False)
    sys.exit(0)
