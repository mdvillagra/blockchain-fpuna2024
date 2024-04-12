package com.amilcargimenez.merkletree;

import io.bretty.console.tree.PrintableTreeNode;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class MerkleNode implements PrintableTreeNode {
    private String hash;
    private MerkleNode father;
    private boolean isLeft;
    private MerkleNode leftChild;
    private MerkleNode rightChild;

    public MerkleNode(String hash) {
        this.hash = hash;
    }

    @Override
    public String name() {
        String hashCorto = this.hash.substring(this.hash.length() - 5);
        if(this.getFather()!=null){
            return isLeft()?"izquierdo, hash: " + hashCorto:"derecho, hash: " + hashCorto;
        }else {
            return "raíz, hash: " + hashCorto;
        }
    }

    @Override
    public List<MerkleNode> children() {
        List<MerkleNode> children = new ArrayList<>();
        if (this.leftChild != null) {
            children.add(this.leftChild);
        }
        if (this.rightChild != null) {
            children.add(this.rightChild);
        }
        return children;
    }
}