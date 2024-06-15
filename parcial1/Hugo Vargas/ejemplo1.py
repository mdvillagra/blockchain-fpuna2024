import math
from merkleTree import *


TEST1 = [4661681, 987218, 31450478, 13499476]

# Ejemplo 1
tree1 = merkleTree()
levels = math.floor(math.log2(len(TEST1))) + 1
tree1.createTree(TEST1)
tree1.calculateMerkleRoot()
tree1.prettyPrintTree(levels)
print('\n\n')
proof = tree1.getMerkleProof(74648, levels)
print(f"El resultado del verifyMerkleProof fue: {tree1.verifyMerkleProof(proof)}")