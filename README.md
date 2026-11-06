# Go-React Blockchain

A full-stack blockchain implementation featuring a high-performance Go backend (handling Merkle trees and transactions) and an interactive React + Vite frontend.

## Features
- Custom blockchain logic written in Go.
- Transaction handling and Merkle tree generation.
- Interactive UI built with React and Vite.
- API integration between the frontend and backend.

## Repository Structure

```text
Blockchain/
│
├── .gitignore                   # Files to ignore (node_modules, binaries, etc.)
├── README.md                    # Project documentation
│
├── api/                         # Go Backend
│   ├── server.go                # Main API server entry point
│   │
│   └── blockchain/              # Core Blockchain logic
│       ├── block.go             # Block data structure
│       ├── blockchain.go        # Chain management and validation
│       ├── merkletree.go        # Merkle tree implementation
│       └── transactions.go      # Transaction handling
│
└── Frontend/                    # React Frontend (Vite)
    ├── index.html               # HTML entry point
    ├── package.json             # Node dependencies and scripts
    ├── vite.config.js           # Vite configuration
    │
    └── src/                     # React source code
        ├── api.js               # API calls to the Go backend
        ├── App.jsx              # Main React component
        ├── App.css              # Application styles
        └── main.jsx             # React DOM rendering