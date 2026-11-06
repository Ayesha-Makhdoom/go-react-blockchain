package blockchain

import (
	"fmt"
	"strings"
	"sync"
)

const MINING_DIFFICULTY = 3

type Blockchain struct {
	Name            string
	mu              sync.Mutex
	transactionPool []*Transaction
	chain           []*Block
}

func NewBlockchain(name string, firstTransaction string) *Blockchain {
	bc := &Blockchain{Name: name}
	// Genesis block carries the first transaction of the chain
	bc.AddTransaction(firstTransaction)
	bc.CreateBlock(0, [32]byte{})
	return bc
}

func (bc *Blockchain) CreateBlock(nonce int, prevHash [32]byte) *Block {

	index := len(bc.chain)

	b := NewBlock(index, nonce, prevHash, bc.transactionPool)

	b.Hash = b.CalculateHash()

	bc.chain = append(bc.chain, b)
	bc.transactionPool = []*Transaction{}
	return b
}

func (bc *Blockchain) LastBlock() *Block {
	return bc.chain[len(bc.chain)-1]
}

func (bc *Blockchain) Print() {
	for i, block := range bc.chain {
		fmt.Printf("%s Chain %d %s\n", strings.Repeat("=", 25), i, strings.Repeat("=", 25))
		block.Print()
	}
	fmt.Printf("%s\n", strings.Repeat("*", 25))
}

func (bc *Blockchain) AddTransaction(data string) {
	bc.mu.Lock()
	defer bc.mu.Unlock()
	t := NewTransaction(data)
	bc.transactionPool = append(bc.transactionPool, t)
}

func ValidProof(b *Block, difficulty int) bool {
	zeros := strings.Repeat("0", difficulty)
	return fmt.Sprintf("%x", b.CalculateHash())[:difficulty] == zeros
}

func ProofOfWork(b *Block, difficulty int) {
	for !ValidProof(b, difficulty) {
		b.Nonce++
	}
	b.Hash = b.CalculateHash()
}

func (bc *Blockchain) Mine() *Block {
	bc.mu.Lock()
	defer bc.mu.Unlock()

	b := NewBlock(len(bc.chain), 0, bc.LastBlock().Hash, bc.transactionPool)
	ProofOfWork(b, MINING_DIFFICULTY)

	bc.chain = append(bc.chain, b)
	bc.transactionPool = []*Transaction{}
	return b
}

func (bc *Blockchain) PendingTransactions() []*Transaction {
	bc.mu.Lock()
	defer bc.mu.Unlock()
	return append([]*Transaction{}, bc.transactionPool...)
}

func (bc *Blockchain) GetChain() []*Block {
	bc.mu.Lock()
	defer bc.mu.Unlock()
	return append([]*Block{}, bc.chain...)
}

func (bc *Blockchain) SearchBlockchain(query string) []*Block {
	bc.mu.Lock()
	defer bc.mu.Unlock()
	foundBlocks := []*Block{}
	for _, block := range bc.chain {
		for _, tx := range block.Transactions {
			if strings.Contains(tx.Data, query) {
				foundBlocks = append(foundBlocks, block)
				break // Found a match in this block, move to next block
			}
		}
	}
	return foundBlocks
}
