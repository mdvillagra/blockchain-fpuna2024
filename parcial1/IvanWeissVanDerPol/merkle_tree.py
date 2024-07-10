# merkle_tree.py
# Import hash_sha256 from utils instead of using hashlib directly
from utils import *
from typing import List, Tuple
from node import Node

class MerkleTree:
    def __init__(self):
        self.leaves: List[Node] = []
        self.levels = []


    def add_node(self, data):
        self.leaves.append(Node(data))
        self.generate_merkle_tree()
        
    def get_merkle_root(self):
        return self.levels[0][0].hash if self.levels else None


    def generate_merkle_tree(self):
        levels = [self.leaves]
        level_number = 0  # Start counting from the leaf level
        while len(levels[0]) > 1:
            current_level = levels[0]
            next_level = []
            for i in range(0, len(current_level), 2):
                left = current_level[i]
                right = current_level[i + 1] if i + 1 < len(current_level) else left
                hash_data = left.hash + ", " + right.hash
                parent = Node(hash_data, left, right)
                next_level.append(parent)
            
            levels.insert(0, next_level)
            level_number += 1
        
        self.levels = levels


    def print_proof(self, proof ):
        """
        Prints the Merkle proof for a given piece of data in a structured format.

        Parameters:
        - proof (List[Tuple[Node, str, int]]): The proof of inclusion to print, as a list of (Node, position, level) tuples.
        """
        try:
            print("Merkle Proof")
            for node, position, level in proof:
                print(f"  Level {level}: {position.title()} sibling with hash {node.hash}")
        except ValueError as e:
            print(e)



    def get_proof(self, data) -> List[Tuple[Node, str, int]]:
        """
        Generates a proof of inclusion for the leaf with the specified data.
        """
        proof = []
        # Find the index of the leaf with the given data
        leaf_index = None
        print(f"Looking for data: {data}")
        for i, node in enumerate(self.leaves):
            if node.data == data:
                leaf_index = i
                print(f"Data found at index {leaf_index} in leaves")
                break

        if leaf_index is None:
            raise ValueError("Leaf data not found in the Merkle Tree")

        # Traverse up the tree from the leaf to the root to compile the proof
        for level in range(len(self.levels) - 1, 0, -1):
            is_right_node = leaf_index % 2
            sibling_index = leaf_index + 1 if not is_right_node else leaf_index - 1
            # Ensure sibling_index is within the current level's bounds
            if sibling_index < len(self.levels[level]):
                sibling_node = self.levels[level][sibling_index]
                position = 'right' if is_right_node else 'left'
                proof.append((sibling_node, position, level - 1))
            leaf_index //= 2  # Move up to the parent node in the next iteration

        return proof



    def verify_proof(self, proof: List[Tuple[Node, str, int]], target_hash, root_hash) -> bool:
        """
        Verifies a proof of inclusion for a specific target hash against the given root hash.
        """
        calculated_hash = target_hash
        for node, position, level in proof:
            if position == 'left':
                hash_data = calculated_hash + ", " + node.hash
            elif position == 'right':
                hash_data = node.hash + ", " + calculated_hash
            else:
                raise ValueError("Invalid node position in proof; must be 'left' or 'right'.")
            calculated_hash = hash_sha256(hash_data)
        verification_result = calculated_hash == root_hash
        return verification_result



    def print_tree(self):
        """
        Prints the structure of the Merkle Tree for visualization,
        showing both the hash values and the actual data in a tree structure.
        Enhanced to improve readability and clarity.
        """

        def print_node(node, prefix="", is_last=True):
            if node is None:
                return
            # Handles the marker for the last node in a level differently to enhance clarity
            branch = "└── " if is_last else "├── "
            # Combine the current prefix with the new branch
            new_prefix = prefix + ("    " if is_last else "│   ")
            print(f"{prefix}{branch}Hash: {node.hash}, Data: {node.data}")
            children = [child for child in [node.left, node.right] if child]
            for i, child in enumerate(children):
                # Pass along the updated prefix and whether this child is the last in the list
                print_node(child, new_prefix, i == len(children) - 1)

        # Start printing from the root node
        if self.levels:
            print("Merkle Tree Structure:")
            root_node = self.levels[0][0]
            print(f"Root Hash: {root_node.hash}, Data: {root_node.data}")
            print_node(root_node.left, "", False)  # Assuming left child is never the last node
            print_node(root_node.right, "", True)  # Assuming right child is always the last node


