# Python Merkle Tree Implementation

This project implements a Merkle Tree in Python, a data structure that is crucial for ensuring the integrity of data blocks in distributed systems like blockchains. By allowing for efficient and secure verification of contents in large bodies of data, Merkle Trees play a fundamental role in various cryptographic applications. This implementation offers a straightforward way to understand, generate, and interact with Merkle Trees, including functionality for adding nodes, generating the tree, and verifying proofs of inclusion.

## Features

- **Node Management:** Add any piece of data as a node within the Merkle Tree.
- **Merkle Root Calculation:** Automatically calculate the Merkle Root of the tree.
- **Proof Generation:** Generate proofs of inclusion for individual nodes.
- **Proof Verification:** Verify the proofs of inclusion for nodes against the Merkle Root.

## Project Structure

- `node.py`: Defines the `Node` class, encapsulating the data and hash information for each node.
- `merkle_tree.py`: Implements the `MerkleTree` class, responsible for the tree's logic, including adding nodes and generating the tree.
- `main.py`: An example script demonstrating how to use the Merkle Tree, including adding nodes, printing the tree, and verifying a node's proof.
- `utils.py`: Contains utility functions that support the main functionality (if any).

## Getting Started

### Prerequisites

Ensure you have Python 3.6 or higher installed on your machine. This project does not require external libraries.

### Running the Example

To run the included example, use the following command in the project directory:
cd merkle-tree-python

cd parcial1\IvanWeissVanDerPol 
python main.py

