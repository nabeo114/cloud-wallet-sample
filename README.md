# Cloud Wallet Sample

This project demonstrates a cloud-based wallet application, combining a backend built with Node.js and a frontend developed in TypeScript. The application provides the following functionalities:

- **Server-Side Wallet Creation**: Create Ethereum wallet accounts on the server side.
- **Contract Deployment**: Deploy smart contracts using the created wallet accounts on the server side.
- **Method Execution**: Execute methods on the deployed contracts from both the frontend and backend.

The application allows users to manage their wallets and interact with deployed smart contracts, integrating blockchain technology seamlessly into both the frontend and backend components.

## Prerequisites

- **Git**: Ensure that Git is installed on your system. You can download it from [Git Downloads](https://git-scm.com/downloads).
- **Node.js**: Install Node.js. It is recommended to use [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) to manage Node.js versions. First, install `nvm` using the following command:

  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  ```

  After installing `nvm`, install Node.js using these commands:

  ```bash
  nvm install --lts
  npm install -g npm
  ```

- **Windows Users**: If you are using Windows, it is recommended to use WSL2 with an Ubuntu environment. Follow the [WSL2 Installation Guide](https://learn.microsoft.com/en-us/windows/wsl/install) to set up WSL2 and install Ubuntu.

## Features

- **Wallet Management:** Create and manage cryptocurrency wallets.
- **Backend:**
  - Create Ethereum wallet accounts on the server side.
  - Deploy ERC20 and ERC721 smart contracts using the created wallet accounts.
  - Execute methods that trigger transactions on the contracts (e.g., token transfers, NFT mints).
  - **Note**: Contracts are deployed on the Polygon Amoy testnet. Before deploying contracts, ensure that the wallet address created on the server has MATIC tokens. You can use the Polygon Faucet to fund the address: [Polygon Faucet](https://faucet.polygon.technology/).
- **Frontend:**
  - TypeScript-based interface for user interaction.
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

**Note**: To run the backend, you need to create a `.env` file in the `backend` directory and set the `INFURA_API_KEY` environment variable. You can obtain your API key by creating an account at [Infura](https://app.infura.io/). Use your specific API key value for this variable, which should be set as follows:

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
