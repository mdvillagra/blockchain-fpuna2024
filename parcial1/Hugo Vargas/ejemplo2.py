import math
from merkleTree import *


TEST2 = [111985, 333651968971, 447859412, 1122548345]

# Ejemplo 1
tree1 = merkleTree()
levels = math.floor(math.log2(len(TEST2))) + 1
tree1.createTree(TEST2)
tree1.calculateMerkleRoot()
tree1.prettyPrintTree(levels)
print('\n\n')
proof = tree1.getMerkleProof(333651968971, levels)
print(f"El resultado del verifyMerkleProof fue: {tree1.verifyMerkleProof(proof)}")