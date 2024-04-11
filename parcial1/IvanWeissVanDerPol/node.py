# Updated node.py to use hash_sha256 from utils.py
from utils import hash_sha256

class Node:
    def __init__(self, data, left=None, right=None):
        self.data = data
        self.hash = hash_sha256(data)
        self.left = left
        self.right = right
        
    def is_leaf(self):
        return not self.left and not self.right

