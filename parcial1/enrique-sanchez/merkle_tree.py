from itertools import product, permutations

import poseidon

class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None

    def __str__(self):
        return self.data

    def is_leaf(self):
        return self.left is None and self.right is None

class MerkleTree:
    def __init__(self, transactions):
        self.transactions = transactions
        poseidon_hash, t = poseidon.case_simple()
        self.poseidon_hash = poseidon_hash
        self.tree = self._build_tree()
        self._merkleRoot = None
        self._calculate_Merkle_Root()

    def _hash_transaction(self, transaction):
        return self.poseidon_hash.run_hash(transaction)

    def _build_tree(self):
        def _no_of_nodes_required(arr):
            x = len(arr)
            return 2 * x - 1

        def _build_tree(arr, root, i, n):
            if i < n:
                temp = Node(str(arr[i]))
                root = temp

                root.left = _build_tree(arr, root.left, 2 * i + 1, n)
                root.right = _build_tree(arr, root.right, 2 * i + 2, n)

            return root

        def _add_leaf_data(arr, node):
            if not node:
                return

            _add_leaf_data(arr, node.left)
            if node.is_leaf():
                x = arr.pop(0)
                node.data = self._hash_transaction([x])
            else:
                node.data = ''
            _add_leaf_data(arr, node.right)

        nodes_required = _no_of_nodes_required(self.transactions)
        node_arr = [num for num in range(1, nodes_required + 1)]
        root_node = _build_tree(node_arr, None, 0, nodes_required)
        _add_leaf_data(self.transactions, root_node)

        return root_node

    def _calculate_Merkle_Root(self):
        def _merkleHash(node):
            if node.is_leaf():
                return node

            left = _merkleHash(node.left).data
            right = _merkleHash(node.right).data
            node.data = self._hash_transaction([left, right])
            return node

        merkleRoot = _merkleHash(self.tree)
        self._merkleRoot = merkleRoot.data

        return self._merkleRoot

    def print_tree(self):
        def _print_tree(node, level=0):
            if node:
                print(' ' * (level * 4) + str(node.data))
                _print_tree(node.left, level + 1)
                _print_tree(node.right, level + 1)

        _print_tree(self.tree)

    def get_root(self):
        return self._merkleRoot

    def get_merkle_proof(self, transaction):
        proof = []

        def _get_proof(node):
            if node is None:
                return False, None

            if node.is_leaf() and node.data == self._hash_transaction([transaction]):
                return True, None

            left_proof, left_sibling = _get_proof(node.left)
            right_proof, right_sibling = _get_proof(node.right)

            if left_proof:
                proof.append((node.right.data, 'left'))
                return True, node.left.data
            elif right_proof:
                proof.append((node.left.data, 'right'))
                return True, node.right.data

            return False, None

        found, sibling = _get_proof(self.tree)

        return proof, sibling

    def verify_merkle_proof(self, transaction, proof):
        current_hash = self._hash_transaction([transaction])

        for sibling, direction in proof:
            if direction == 'left':
                current_hash = self._hash_transaction([current_hash, sibling])
            elif direction == 'right':
                current_hash = self._hash_transaction([sibling, current_hash])
            else:
                raise ValueError("Invalid direction in proof")

        return current_hash == self._merkleRoot
