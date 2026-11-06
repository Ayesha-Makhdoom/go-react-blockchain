package api

import (
	"encoding/json"
	"my-blockchain/blockchain" // Replace with your actual module name
	"net/http"
)

type Server struct {
	Blockchain *blockchain.Blockchain
}

func (s *Server) InfoHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"name": s.Blockchain.Name})
}

func (s *Server) PendingHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(s.Blockchain.PendingTransactions())
}

func (s *Server) GetChainHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(s.Blockchain.GetChain())
}

func (s *Server) AddTransactionHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Data string `json:"data"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	s.Blockchain.AddTransaction(req.Data)
	w.WriteHeader(http.StatusCreated)
}

func (s *Server) MineHandler(w http.ResponseWriter, r *http.Request) {
	block := s.Blockchain.Mine()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(block)
}

func (s *Server) SearchHandler(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	results := s.Blockchain.SearchBlockchain(query)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}
