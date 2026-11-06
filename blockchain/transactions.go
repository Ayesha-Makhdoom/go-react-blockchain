package blockchain

import (
	"encoding/json"
	"fmt"
	"strings"
)

type Transaction struct {
	Data string `json:"data"` 
}

func NewTransaction(data string) *Transaction {
	return &Transaction{Data: data}
}

func (t *Transaction) Print() {
	fmt.Printf("%s\n", strings.Repeat("-", 40))
	fmt.Printf(" Data: %s\n", t.Data)
}

func (t *Transaction) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Data string `json:"data"`
	}{
		Data: t.Data,
	})
}
