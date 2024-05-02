package org.example;

import com.loopring.poseidon.PoseidonHash;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

public class MerkleTree {

    // Clase anidada que representa un nodo del árbol de Merkle
    private static class Node {
        final byte[] hash;
        final Node left;
        final Node right;

        // Constructor de la clase Node
        public Node(byte[] hash, Node left, Node right) {
            this.hash = hash;
            this.left = left;
            this.right = right;
        }
    }

    private Node root; // Raíz del árbol de Merkle

    // Constructor de la clase MerkleTree
    public MerkleTree() {
        this.root = null;
    }

    // Método para crear el árbol de Merkle a partir de una lista de datos
    public void createTree(List<Object> data) {
        List<Node> leaves = new ArrayList<>();

        // Se hashean los elementos de la lista y se agregan como hojas al árbol
        for (Object obj : data) {
            byte[] bytes = objectToBytes(obj);
            leaves.add(new Node(poseidonHash(bytes, new byte[0]), null, null));
        }

        // Se calculan los nodos internos del árbol
        while (leaves.size() > 1) {
            List<Node> parents = new ArrayList<>();

            // Se toman las hojas de dos en dos y se calcula su hash combinado
            for (int i = 0; i < leaves.size(); i += 2) {
                Node left = leaves.get(i);
                Node right = (i + 1 < leaves.size()) ? leaves.get(i + 1) : new Node(poseidonHash(new byte[0], new byte[0]), null, null);
                byte[] combinedHash = poseidonHash(left.hash, (right != null ? right.hash : new byte[0]));
                Node parent = new Node(combinedHash, left, right);
                parents.add(parent);
            }

            leaves = parents;
        }

        root = leaves.get(0); // La raíz del árbol es el único nodo restante en la lista
    }

    // Método para obtener la raíz del árbol de Merkle
    public String getMerkleRoot() {
        return root != null ? bytesToHex(root.hash) : null;
    }

    // Método para obtener la prueba de Merkle para un dato específico
    public String getMerkleProof(byte[] data) {
        if (root == null) {
            return null;
        }

        List<String> proof = new ArrayList<>();
        if (!findMerkleProof(root, data, proof)) {
            return null;
        }

        StringBuilder proofString = new StringBuilder();
        for (String hash : proof) {
            proofString.append(hash).append(",");
        }
        return proofString.toString();
    }

    // Método recursivo para encontrar la prueba de Merkle para un dato específico
    private boolean findMerkleProof(Node node, byte[] data, List<String> proof) {
        if (node == null) {
            return false;
        }

        if (areArraysEqual(node.hash, data)) {
            return true;
        }

        if (findMerkleProof(node.left, data, proof)) {
            proof.add(bytesToHex(node.right != null ? node.right.hash : node.left.hash));
            return true;
        }

        if (findMerkleProof(node.right, data, proof)) {
            proof.add(bytesToHex(node.left.hash));
            return true;
        }

        return false;
    }

    // Método para verificar la prueba de Merkle
    public boolean verifyMerkleProof(String rootHash, String proofString, byte[] data) {
        if (proofString == null) {
            return false;
        }

        String[] proofArray = proofString.split(",");
        byte[] computedHash = data;
        for (String s : proofArray) {
            computedHash = poseidonHash(hexToBytes(s), computedHash);
        }
        return rootHash.equals(bytesToHex(computedHash));
    }

    // Método para realizar el hash de dos bytes usando Poseidon
    public byte[] poseidonHash(byte[] a, byte[] b) {
        PoseidonHash.PoseidonParamsType params = PoseidonHash.DefaultParams;
        PoseidonHash.Digest poseidon = PoseidonHash.Digest.newInstance(params);
        BigInteger suma = new BigInteger(1, a).add(new BigInteger(1, b));
        poseidon.add(suma);
        return poseidon.digest();
    }

    // Método para convertir un objeto a un arreglo de bytes
    public byte[] objectToBytes(Object obj) {
        if (obj instanceof byte[]) {
            return (byte[]) obj;
        } else if (obj instanceof String) {
            return ((String) obj).getBytes();
        } else if (obj instanceof Integer) {
            return BigInteger.valueOf((Integer) obj).toByteArray();
        } else if (obj instanceof Double) {
            return BigInteger.valueOf(Double.doubleToRawLongBits((Double) obj)).toByteArray();
        }
        // Manejar otros tipos de datos según sea necesario
        return new byte[0];
    }

    //Método para convertir un arreglo de bytes a una representación hexadecimal
    public String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

    // Método para convertir una cadena hexadecimal a un arreglo de bytes
    public byte[] hexToBytes(String hexString) {
        byte[] bytes = new byte[hexString.length() / 2];
        for (int i = 0; i < bytes.length; i++) {
            int index = i * 2;
            int j = Integer.parseInt(hexString.substring(index, index + 2), 16);
            bytes[i] = (byte) j;
        }
        return bytes;
    }

    // Método para verificar si dos arreglos de bytes son iguales
    private boolean areArraysEqual(byte[] a, byte[] b) {
        if (a.length != b.length) {
            return false;
        }
        for (int i = 0; i < a.length; i++) {
            if (a[i] != b[i]) {
                return false;
            }
        }
        return true;
    }

    // Método para imprimir el árbol de Merkle
    public void printMerkleTree() {
        printMerkleTree(root, 0);
    }

    // Método auxiliar recursivo para imprimir el árbol de Merkle
    private void printMerkleTree(Node node, int level) {
        if (node == null) {
            return;
        }

        // Imprimir hash del nodo actual
        System.out.println(getIndent(level) + "Hash: " + bytesToHex(node.hash));

        // Imprimir subárboles izquierdo y derecho
        if (node.left != null || node.right != null) {
            System.out.println(getIndent(level) + "Left:");
            printMerkleTree(node.left, level + 1);

            System.out.println(getIndent(level) + "Right:");
            printMerkleTree(node.right, level + 1);
        }
    }

    // Método para generar espacios en blanco según el nivel del árbol
    private String getIndent(int level) {
        StringBuilder indent = new StringBuilder();
        for (int i = 0; i < level; i++) {
            indent.append("  "); // Dos espacios por nivel
        }
        return indent.toString();
    }
}