# Cloud Wallet Sample

This project demonstrates a cloud-based wallet application, combining a backend built with Node.js and a frontend developed in TypeScript. The application allows users to create and manage wallets, with functionalities likely related to blockchain technology.

## Features

- **Wallet Management:** Create and manage cryptocurrency wallets.
- **Backend:** Node.js server for handling wallet operations.
  - Create a wallet account on the server side.
  - Deploy contracts using the account on the server side.
  - Support for ERC20 and ERC721 contracts.
  - Execute methods that trigger transactions on the contracts (e.g., token transfers, NFT mints).
  - **Note**: Contracts are deployed on the Polygon Amoy testnet. Before deploying contracts, ensure that the wallet address created on the server has MATIC tokens. You can use the Polygon Faucet to fund the address: [Polygon Faucet](https://faucet.polygon.technology/).
- **Frontend:** TypeScript-based interface for user interaction.
  - Execute non-transactional methods on the contracts using their addresses and ABIs.

## Installation

### 1. Clone the Repository:

```bash
git clone https://github.com/nabeo114/cloud-wallet-sample.git
```

### 2. Backend Setup:

```bash
cd backend
npm install
npm start
```

**Note**: To run the backend, you need to create a `.env` file in the `backend` directory and set the `INFURA_API_KEY` environment variable. Use your specific API key value for this variable, which you can obtain from your development environment.

```plaintext
INFURA_API_KEY=your_infura_api_key_here
```

### 3. Frontend Setup:

```bash
cd frontend
npm install
npm start
```

## Usage

After installation, the backend and frontend will be running on their respective ports:
- **Frontend:** Access the application at `http://localhost:8080/`.
- **Backend:** The server will be running at `http://localhost:5000/`.

Access the frontend through your browser to interact with the wallet functionalities.
