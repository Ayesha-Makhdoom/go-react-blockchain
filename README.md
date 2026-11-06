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

## Tech Stack

**Backend**
![Go](https://img.shields.io/badge/Go-00ADD8?style=flat-square&logo=go&logoColor=white)

**Frontend**
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)

### 1. Prerequisites

Before you begin, ensure you have the following installed on your system:

![Go](https://img.shields.io/badge/Go-00ADD8?style=flat-square&logo=go&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=flat-square&logo=node.js&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=flat-square&logo=npm&logoColor=white)

* **Go (Golang)** - Required to compile and run the backend API.
* **Node.js & npm** - Required to install React dependencies and run the Vite frontend.