const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { generateWallet, getWalletInfo } = require('./scripts/walletUtils');
const { compileContracts } = require('./scripts/compile');
const { deployContract } = require('./scripts/deploy');
const { getContractInfo } = require('./scripts/contractUtils');
const { transferTokens } = require('./scripts/contractMethods');
const { getAssetInfo } = require('./scripts/assetUtils');

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
  const { recipientAddress, transferAmount } = req.body;

  try {
    const txHash = await transferTokens(recipientAddress, transferAmount);
    if (!txHash) {
      return res.status(500).json({ error: 'Failed to transfer tokens' });
    }
    res.status(200).json({ transactionHash: txHash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NFTメタデータを取得するエンドポイント
app.get('/assets/:tokenId', async (req, res) => {
  const { tokenId } = req.params;

  try {
    const assetData = await getAssetInfo(tokenId);
    if (!assetData) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json(assetData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
