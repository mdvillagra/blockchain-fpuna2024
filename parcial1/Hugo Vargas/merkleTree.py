from poseidon_hash.poseidon.parameters import *


class Node():
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None

    def isFull(self):
        return self.left and self.right

    def __str__(self):
        return self.data

    def isLeaf(self):
        return ((self.left == None) and (self.right == None))

class merkleTree():

    def __init__(self):
        self.root = None
        self._merkleRoot = ''

        poseidonHasher, t = case_simple()
        self.hasher = poseidonHasher

    def __returnHash(self, x):
            return (self.hasher.run_hash(x))
    
    def createTree(self, arr):

        def __noOfNodesReqd(arr):
            x = len(arr)
            return (2*x - 1)

        def __buildTree(arr, root, i, n): 
            # Base case for recursion  
            if i < n: 
                temp = Node(str(arr[i]))  
                root = temp  

                # insert left child  
                root.left = __buildTree(arr, root.left,2 * i + 1, n)  

                # insert right child  
                root.right = __buildTree(arr, root.right,2 * i + 2, n) 
                
            return root

        def __addLeafData(arr, node):
            
            if not node:
                return
            
            __addLeafData(arr, node.left)
            if node.isLeaf():
                x = arr.pop(0)
                node.data = self.__returnHash([x])
            else:
                node.data = ''
            __addLeafData(arr, node.right)
        
        nodesReqd = __noOfNodesReqd(arr)
        nodeArr = [num for num in range(1,nodesReqd+1)]
        self.root = __buildTree(nodeArr, None, 0, nodesReqd)
        __addLeafData(arr,self.root)

    def calculateMerkleRoot(self):
    
        def __merkleHash(node):
            if node.isLeaf():
                return node
            
            left = __merkleHash(node.left).data
            right = __merkleHash(node.right).data
            node.data = self.__returnHash([left, right])
            return node
        
        merkleRoot = __merkleHash(self.root)
        self._merkleRoot = merkleRoot.data
        
        return self._merkleRoot 

    
    def getMerkleProof(self, m, levels):
        leafHash = self.hasher.run_hash([m])

        def returnHashesForProof(leafHash, node, level, dictToProof):
            flag = False
            if node.isLeaf():
                if leafHash == node.data:
                    flag = True
                return flag
            
            leftFlag = returnHashesForProof(leafHash, node.left, level+1, dictToProof)
            if not leftFlag:
                rightFlag = returnHashesForProof(leafHash, node.right, level+1, dictToProof)

            if level not in dictToProof:
                dictToProof[level] = {}

            if leftFlag or rightFlag:
                flag = True
                dictToProof[level] = {
                    'guide': 'left' if not leftFlag else 'right',
                    'data': str(node.left.data if not leftFlag else node.right.data),
                    'result': str(node.data)
                }

            return flag
        
        level = 0
        root = self.root
        dictProof = {}
        returnHashesForProof(leafHash, root, level, dictProof)
        
        print(f"El hash del elemnto {m} buscado es: {leafHash}")
        print("Se procedera a hashear por los demas nodos adyacentes del arbol")

        for level in reversed(range(0, levels-1)):
            if 'data' not in dictProof[level]:
                return 0
            data = str(dictProof[level]['data'])
            guide = dictProof[level]['guide']
            result = dictProof[level]['result']
            print(f"Se prueba hashear con: {data}")
            if level == 1:
                if guide == 'left':
                    hashp = str(self.hasher.run_hash([data, str(leafHash)]))
                else:
                    hashp = str(self.hasher.run_hash([str(leafHash), data]))
            else:
                if guide == 'left':
                    hashp = str(self.hasher.run_hash([data, hashp]))
                else:
                    hashp = str(self.hasher.run_hash([hashp, data]))
            print(f"Se obtiene: {hashp}")
            if hashp != result:
                print("entro en el igual")
                return 0
        
        return hashp
    
    def verifyMerkleProof(self, proof):
        res = 0
        if str(self._merkleRoot) == proof:
            res = 1
        
        return res

        
    def prettyPrintTree(self, levels):
        def prettyFormater(node, level, dictToPrint):
            returnFlag = False
            if level not in dictToPrint:
                dictToPrint[level] = []
            nodeData = node.data

            if node.isLeaf():
                returnFlag = True
            dictToPrint[level].append(nodeData)
            
            if returnFlag:
                return
            prettyFormater(node.left, level + 1, dictToPrint)
            prettyFormater(node.right, level + 1, dictToPrint)
        
        level = 0
        tab = ' '*15
        root = self.root
        dictForm = {}
        prettyFormater(root, level, dictForm)
        for level in range(0, levels):
            line = ''
            print(f"Nivel: {level}")
            for nodeData in dictForm[level]:
                line = line + ' '*10 + str(nodeData)
            print(tab*((levels-level)-1), line)