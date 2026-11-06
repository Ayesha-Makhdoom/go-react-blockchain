package blockchain

import (
	"crypto/sha256"
)

func CalculateMerkleRoot(transactions []*Transaction) [32]byte {
	if len(transactions) == 0 {
		return [32]byte{}
	}

	var hashes [][32]byte
	for _, tx := range transactions {

		hash := sha256.Sum256([]byte(tx.Data))
		hashes = append(hashes, hash)
	}

	for len(hashes) > 1 {
		var newLevel [][32]byte

		if len(hashes)%2 != 0 {
			hashes = append(hashes, hashes[len(hashes)-1])
		}

		for i := 0; i < len(hashes); i += 2 {
			combined := append(hashes[i][:], hashes[i+1][:]...)
			newHash := sha256.Sum256(combined)
			newLevel = append(newLevel, newHash)
		}
		hashes = newLevel
	}

	return hashes[0]
}
