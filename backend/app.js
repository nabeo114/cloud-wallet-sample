const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { generateWallet, getWalletInfo } = require('./scripts/walletUtils');
const { compileContracts } = require('./scripts/compile');
const { deployContract } = require('./scripts/deploy');
const { getContractInfo } = require('./scripts/contractUtils');
const { transferTokens, mintNFT, transferNFT } = require('./scripts/contractMethods');
const { generateNFTMetadata, generateNFTImage } = require('./scripts/assetUtils');

const app = express();
const port = 5000;
app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// 新しいウォレットを生成するエンドポイント
app.post('/generate-wallet', async (req, res) => {
  const { password } = req.body;

  try {
    const walletData = await generateWallet(password);
    res.json(walletData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ウォレットのアドレスとKeystore JSONを取得するエンドポイント
app.get('/get-wallet-info', async (req, res) => {
  try {
    const walletData = await getWalletInfo();
    if (!walletData) {
      return res.status(404).json({ error: 'Wallet not found' });
    }
    res.json(walletData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// コントラクトをデプロイするエンドポイント
app.post('/deploy-contract', async (req, res) => {
  const { contractName, constructorArgs } = req.body;

  try {
    await compileContracts();
    const contractData = await deployContract(contractName, constructorArgs);
    if (!contractData) {
      return res.status(404).json({ error: 'Wallet not found' });
    }
    res.json(contractData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// コントラクトアドレスとトランザクションハッシュ、ABIを取得するエンドポイント
app.post('/get-contract-info', async (req, res) => {
  const { contractName } = req.body;

  try {
    const contractData = await getContractInfo(contractName);
    if (!contractData) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    res.json(contractData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// トークンを転送するエンドポイント
app.post('/transfer-tokens', async (req, res) => {
  const { transferRecipientAddress, transferAmount } = req.body;

  try {
    const txHash = await transferTokens(transferRecipientAddress, transferAmount);
    if (!txHash) {
      return res.status(500).json({ error: 'Failed to transfer tokens' });
    }
    res.status(200).json({ transactionHash: txHash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NFTをミントするエンドポイント
app.post('/mint-nft', async (req, res) => {
  const { mintRecipientAddress } = req.body;

  try {
    const txHash = await mintNFT(mintRecipientAddress);
    if (!txHash) {
      return res.status(500).json({ error: 'Failed to mint NFT' });
    }
    res.status(200).json({ transactionHash: txHash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NFTを転送するエンドポイント
app.post('/transfer-nft', async (req, res) => {
  const { transferRecipientAddress, transferTokenId } = req.body;

  try {
    const txHash = await transferNFT(transferRecipientAddress, transferTokenId);
    if (!txHash) {
      return res.status(500).json({ error: 'Failed to transfer NFT' });
    }
    res.status(200).json({ transactionHash: txHash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NFTメタデータを取得するエンドポイント
app.get('/assets/metadata/:tokenId', async (req, res) => {
  const { tokenId } = req.params;

  try {
    const metadata = await generateNFTMetadata(tokenId);
    if (!metadata) {
      return res.status(404).json({ error: 'Metadata not found' });
    }
    res.json(metadata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NFT画像データを取得するエンドポイント
app.get('/assets/image/:imageFile', async (req, res) => {
  const { imageFile } = req.params;

  try {
    const imageData = await generateNFTImage(imageFile);
    if (!imageData) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.setHeader('Content-Type', 'image/png');
    res.send(imageData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
