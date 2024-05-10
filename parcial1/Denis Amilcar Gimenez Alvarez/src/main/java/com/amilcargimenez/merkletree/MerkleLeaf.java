package com.amilcargimenez.merkletree;


import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MerkleLeaf extends MerkleNode{
    MerkleLeaf rightSibling;
    public MerkleLeaf(String hash) {
        super(hash);
    }
}
