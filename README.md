# Simple Blockchain Project

This is a full-stack blockchain project I've been working on. It's split into two main parts: a backend written in Go that handles the core blockchain logic (blocks, transactions, merkle trees, etc.), and a React frontend built with Vite to interact with it.

## Project Structure

Here's a quick breakdown of how the folders are organized:

- **`api/`**: The Go backend. This is where the server runs and where the core blockchain logic lives (inside the `blockchain` subfolder).
- **`Frontend/`**: The React user interface. It uses Vite for fast builds and hot module replacement.

## How to Run It Locally

To get this running on your machine, you'll need to start both the backend and the frontend. 

### 1. Start the Go Backend

Open a terminal and navigate to the `api` folder. Then, run the server:

```bash
cd api
server.go
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

## 🚀 Getting Started

Follow these steps to get the project running on your local machine.

### 1. Prerequisites

Ensure you have the following installed on your system:
*   **Go (Golang)** - To run the backend server.
*   **Node.js & npm** - To run the React frontend.

### 2. Installation

Clone the repository and navigate into the project folder:

```bash
git clone https://github.com/Ayesha-Makhdoom/nyc-taxi-medallion.git
cd Blockchain