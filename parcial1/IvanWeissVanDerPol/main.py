# main.py
from merkle_tree import MerkleTree
from utils import *
from node import Node  
def main():
    # Instantiate the Merkle Tree
    tree = MerkleTree()

    # Sample data to be added to the Merkle Tree
    TestValues = ["test1", "test2", "test3", "test4", "test5", "test6", "test7", "test8"]
    VerificationValues = ["test1", "test2", "test3", "test4", "test5", "test6", "test7", "test8", "invalid"]
    

    # Adding nodes to the Merkle Tree
    for data in TestValues:
        print(f"Adding node with data: {data}")
        tree.add_node(data)

    tree.print_tree()


    # Display the Merkle Root of the tree
    merkle_root = tree.get_merkle_root()
    print(f"\nMerkle Root: {merkle_root}")

    # Generate proof for a specific node (for example, the first node)
    
    for data in VerificationValues:
        try:
            Test_Node = Node(data)
            proof = tree.get_proof(Test_Node.data)
            tree.print_proof(proof)
            # Verify the proof
            is_valid = tree.verify_proof(proof, Test_Node.hash, merkle_root)
            print(f"Verification result for node '{Test_Node.data}': {is_valid}\n")
        except ValueError as e:
            print(f"\nVerification result for node '{data}': {e}")
            
if __name__ == "__main__":
    main()
