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
```


## Tech Stack

**Backend:**
* **Go (Golang)** - Used for the core blockchain logic, handling Merkle trees, transactions, and serving the API.

**Frontend:**
* **React** - For building the user interface.
* **Vite** - Used as the frontend build tool and development server.
* **JavaScript (JSX)** - Core programming language for the frontend logic.
* **CSS** - For styling the application.

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

* **[Go (Golang)](https://go.dev/dl/)** - Required to compile and run the backend API.
* **[Node.js](https://nodejs.org/) & [npm](https://www.npmjs.com/)** - Required to install React dependencies and run the Vite frontend.