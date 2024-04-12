package com.amilcargimenez.merkletree;

import com.loopring.poseidon.PoseidonHash;
import io.bretty.console.tree.TreePrinter;

import java.io.IOException;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static java.lang.System.exit;

public class Main {
    public static void main(String[] args) throws IOException {

        //// Creación de árbol, cambiar para crear un árbol con otros valores
        ArrayList<String> data = new ArrayList<>(Arrays.asList(
                "prueba1", "prueba2", "prueba3", "prueba4", "prueba5"
        ));
        MerkleNode arbol = createTree(data);
        System.out.println("Árbol creado (sólo se muestran los últimos 5 dígitos para mejor visualización): \n" + TreePrinter.toString(arbol));


        //// Prueba de Merkle
        // cambiar el siguiente valor para sacar otro proof que esté en el árbol
        String valorParaProof = "prueba3";
        MerkleNode prueba = new Main().getMerkleProof(arbol, valorParaProof);
        System.out.println("Prueba de Merkle: \n" + TreePrinter.toString(prueba));



        //// Verificación de Merkle
        //Creación del nodo target con su hash
        PoseidonHash.PoseidonParamsType params = PoseidonHash.DefaultParams;
        PoseidonHash.Digest poseidon = PoseidonHash.Digest.newInstance(params);

        // Prepara el nodo al que pertenece el proof para verificar, cambiar si se desea verificar otro valor
        String valorAVerificar = "prueba3";
        poseidon.add(new BigInteger(1, valorAVerificar.getBytes()));
        String targetHash = poseidon.digest(false)[0].toString(16);
        poseidon.reset();
        MerkleNode target = new MerkleNode(targetHash);


        int verificacion = new Main().verifyMerkleProof(arbol, prueba, target);
        System.out.println("Verificación de Merkle para el hash " + targetHash + ": " + verificacion);
    }

    private static MerkleNode createTree(List<String> data) {
        // Prepara los parámetros del hash de poseidón, se utilizarán los parámetros por defecto
        PoseidonHash.PoseidonParamsType params = PoseidonHash.DefaultParams;
        PoseidonHash.Digest poseidon = PoseidonHash.Digest.newInstance(params);
        // Lista de nodos hoja del árbol
        List<MerkleNode> nodes = new ArrayList<>();

        // Crea nodos hoja para cada pieza de datos y los enlaza con un puntero (se podrá utilizar para buscar más rápidamente un valor)
        MerkleLeaf lastNode = null;
        for (String datum : data) {
            // Agrega los bytes y aplica la función de hash
            poseidon.add(new BigInteger(1, datum.getBytes()));
            // Lo pasa a hexadecimal y en String
            String newNodeHashString = poseidon.digest(false)[0].toString(16);
            // Resetea el hash
            poseidon.reset();
            MerkleLeaf newNode = new MerkleLeaf(newNodeHashString);
            nodes.add(newNode);
            if (lastNode != null) {
                lastNode.setRightSibling(newNode);
            }
            lastNode = newNode;
        }

        // Construye el árbol basándose en los nodos hoja
        while (nodes.size() > 1) {
            List<MerkleNode> upperLevel = new ArrayList<>();

            for (int i = 0; i < nodes.size(); i += 2) {
                // Para el último nodo sin par, lo duplica
                MerkleNode rightChild = i + 1 < nodes.size() ? nodes.get(i + 1) : nodes.get(i);
                MerkleNode leftChild = nodes.get(i);
                // Combina los hashes de los nodos hijos y hace el hash
                poseidon.add(new BigInteger((leftChild.getHash() + rightChild.getHash()), 16));
                String combinedHash = poseidon.digest(false)[0].toString(16);
                poseidon.reset();
                // Crea el nodo
                MerkleNode parentNode = new MerkleNode(combinedHash);
                // Crea las relaciones entre los nodos
                leftChild.setFather(parentNode);
                leftChild.setLeft(true);
                rightChild.setFather(parentNode);
                rightChild.setLeft(false);
                parentNode.setLeftChild(leftChild);
                parentNode.setRightChild(rightChild);
                upperLevel.add(parentNode);
            }

            nodes = upperLevel; // Mover al siguiente nivel
        }

        return nodes.get(0); // La raíz del árbol
    }

    private MerkleNode getMerkleProof(MerkleNode root, String target) {
        System.out.println("Buscando el nodo hoja que contiene el valor objetivo: " + target);
        // Prepara los parámetros del hash de poseidón, se utilizarán los parámetros por defecto
        PoseidonHash.PoseidonParamsType params = PoseidonHash.DefaultParams;
        PoseidonHash.Digest poseidon = PoseidonHash.Digest.newInstance(params);
        // Busca el nodo hoja que contiene el valor objetivo
        MerkleLeaf targetNode = null;
        poseidon.add(new BigInteger(1, target.getBytes()));
        String targetHash = poseidon.digest(false)[0].toString(16);
        System.out.println("Hash objetivo: " + targetHash);

        MerkleNode currentNode = root;

        while (!(currentNode instanceof MerkleLeaf)) {
            currentNode = currentNode.getLeftChild();
        }
        MerkleLeaf leaf = (MerkleLeaf) currentNode;
        boolean founded = false;
        try {
            while (!founded) {
                if (leaf.getHash().equals(targetHash)) {
                    founded = true;
                } else {
                    leaf = leaf.getRightSibling();
                }
            }
        } catch (NullPointerException e) {
            exit(2);
        }
        targetNode = leaf;


        // Construye la prueba de Merkle
        /**
         * Lo que hace este proof es hacer algo así como un camino desde la hoja a la raíz
         * primero agarra la hoja A, verifica si está a la izquierda o a la derecha de su padre
         * luego crea un nodo B con el hash del hermano y lo enlaza con el nodo A,
         * el nodo B se pone como hijo izquierdo o derecho del nodo A, así, se puede ir rehaciendo los hashes
         * sabiendo que si el nodo hijo está a la izquierda o a la derecha, dicho nodo era su hermano izquierdo
         * o derecho, respectivamente
         */
        // Crea el primer nodo, desde abajo, comenzando con su hermano
//        MerkleNode proof = new MerkleLeaf(targetNode.getHash());
        MerkleNode firstSibling = targetNode.isLeft() ? targetNode.getFather().getRightChild() : targetNode.getFather().getLeftChild();
        MerkleNode proof = new MerkleNode(firstSibling.getHash());
        MerkleNode currentProofNode = proof;
        currentProofNode.setLeft(!targetNode.isLeft());
        // El nodo del árbol desde donde se va a sacar el proof
        currentNode = targetNode.getFather();
        // Mientras no se llegue a la raíz
        while (currentNode.getFather() != null) {
            MerkleNode father = currentNode.getFather();
            MerkleNode sibling = null;
            MerkleNode newProofNode = null;
            // Busca el hermano del nodo actual
            if (currentNode.isLeft()) {
                sibling = father.getRightChild();
                newProofNode = new MerkleNode(sibling.getHash());
                newProofNode.setLeft(sibling.isLeft());
                newProofNode.setFather(currentProofNode);
                currentProofNode.setRightChild(newProofNode);
            } else {
                sibling = father.getLeftChild();
                newProofNode = new MerkleNode(sibling.getHash());
                newProofNode.setLeft(sibling.isLeft());
                newProofNode.setFather(currentProofNode);
                currentProofNode.setLeftChild(newProofNode);

            }
            currentProofNode = newProofNode;
            currentNode = father;
        }
        return proof;
    }

    private int verifyMerkleProof(MerkleNode root, MerkleNode proof, MerkleNode target) {
        PoseidonHash.PoseidonParamsType params = PoseidonHash.DefaultParams;
        PoseidonHash.Digest poseidon = PoseidonHash.Digest.newInstance(params);
        if (proof.isLeft()){
            target.setLeftChild(proof);
        }else{
            target.setRightChild(proof);
            target.setLeft(true);
        }
        MerkleNode currentNode = target;
        String currentHash = target.getHash();
        while (currentNode.getLeftChild() != null || currentNode.getRightChild() != null) {
            MerkleNode nextChild = currentNode.getRightChild()==null?currentNode.getLeftChild():currentNode.getRightChild();
            if (currentNode.isLeft()) {
                poseidon.add(new BigInteger((currentHash + nextChild.getHash()), 16));

            } else {
                poseidon.add(new BigInteger((nextChild.getHash() + currentHash), 16));
            }
            currentHash = poseidon.digest(false)[0].toString(16);
            poseidon.reset();
            currentNode = nextChild;
        }
        return root.getHash().equals(currentHash) ? 1 : 0;
    }
}