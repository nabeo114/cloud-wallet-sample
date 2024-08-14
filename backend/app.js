const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { generateWallet, getWalletInfo } = require('./scripts/walletUtils');
const { deployContract, getContractInfo } = require('./scripts/deploy');
const { compileContracts } = require('./scripts/compile');

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
  try {
    await compileContracts();
    const contractData = await deployContract();
    if (!contractData) {
      return res.status(404).json({ error: 'Wallet not found' });
    }
    res.json(contractData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// コントラクトアドレスとトランザクションハッシュ、ABIを取得するエンドポイント
app.get('/get-contract-info', async (req, res) => {
  try {
    const contractData = await getContractInfo();
    if (!contractData) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    res.json(contractData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
