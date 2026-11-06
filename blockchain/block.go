package blockchain

import (
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"time"
)

type Block struct {
	Index        int            `json:"index"`
	Timestamp    int64          `json:"timestamp"`
	Nonce        int            `json:"nonce"`
	PrevHash     [32]byte       `json:"prev_hash"`
	Hash         [32]byte       `json:"hash"`
	MerkleRoot   [32]byte       `json:"merkle_root"` 
	Transactions []*Transaction `json:"transactions"`
}

func NewBlock(index int, nonce int, prevHash [32]byte, transactions []*Transaction) *Block {
	b := new(Block)
	b.Index = index
	b.Timestamp = time.Now().UnixNano()
	b.Nonce = nonce
	b.PrevHash = prevHash
	b.Transactions = transactions

	b.MerkleRoot = CalculateMerkleRoot(transactions)

	return b
}

func (b *Block) CalculateHash() [32]byte {
	m, _ := json.Marshal(struct {
		Index        int
		Timestamp    int64
		Nonce        int
		PrevHash     [32]byte
		MerkleRoot   [32]byte
		Transactions []*Transaction
	}{
		Index:        b.Index,
		Timestamp:    b.Timestamp,
		Nonce:        b.Nonce,
		PrevHash:     b.PrevHash,
		MerkleRoot:   b.MerkleRoot,
		Transactions: b.Transactions,
	})
	return sha256.Sum256(m)
}

func (b *Block) Print() {
	fmt.Printf("index                  %d\n", b.Index)
	fmt.Printf("timestamp              %d\n", b.Timestamp)
	fmt.Printf("nonce                  %d\n", b.Nonce)
	fmt.Printf("prevHash               %x\n", b.PrevHash)
	fmt.Printf("hash                   %x\n", b.Hash)
	fmt.Printf("merkleRoot             %x\n", b.MerkleRoot)
	for _, t := range b.Transactions {
		t.Print()
	}
}

func (b *Block) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Index        int            `json:"index"`
		Timestamp    int64          `json:"timestamp"`
		Nonce        int            `json:"nonce"`
		PrevHash     string         `json:"previous_hash"`
		Hash         string         `json:"hash"`
		MerkleRoot   string         `json:"merkle_root"`
		Transactions []*Transaction `json:"transactions"`
	}{
		Index:        b.Index,
		Timestamp:    b.Timestamp,
		Nonce:        b.Nonce,
		PrevHash:     fmt.Sprintf("%x", b.PrevHash),
		Hash:         fmt.Sprintf("%x", b.Hash),
		MerkleRoot:   fmt.Sprintf("%x", b.MerkleRoot),
		Transactions: b.Transactions,
	})
}
