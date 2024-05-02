package org.example;

import java.util.ArrayList;
import java.util.List;

public class Main {

    public static void main(String[] args) {
        // Crear instancia de la clase MerkleTree
        MerkleTree merkleTree = new MerkleTree();
        // Crear una lista de datos a cargar al árbol
        List<Object> data = new ArrayList<>();
        data.add("Hello");
        data.add("Elizardo");
        data.add(5);

        // Crear el árbol de Merkle
        merkleTree.createTree(data);

        // Obtener la raíz de Merkle
        String merkleRoot = merkleTree.getMerkleRoot();
        System.out.println("Merkle Root: " + merkleRoot);

        // Preparar el dato específico y obtener su hash con Poseidon
        Object merkleProofTarget = 56;
        byte[] merkleProofTargetBytesHashed = getPoseidonHashInBytes(merkleProofTarget, merkleTree);

        System.out.println("Poseidon Hash for " + merkleProofTarget + ": " + merkleTree.bytesToHex(merkleProofTargetBytesHashed));
        // Obtener la prueba de Merkle para el dato específico
        String merkleProof = merkleTree.getMerkleProof(merkleProofTargetBytesHashed);
        System.out.println("Merkle Proof for " + merkleProofTarget + ": " + merkleProof);

        // Verificar la prueba de Merkle
        boolean verificationResult = merkleTree.verifyMerkleProof(merkleRoot, merkleProof, merkleProofTargetBytesHashed);
        System.out.println("Verification Result: " + verificationResult);
    }

    // Método auxiliar para obtener el hash del dato específico usando Poseidon
    static byte[] getPoseidonHashInBytes(Object target, MerkleTree merkleTree) {
        byte[] merkleProofTargetBytes = merkleTree.objectToBytes(target);
        return merkleTree.poseidonHash(merkleProofTargetBytes, new byte[0]);
    }
}
