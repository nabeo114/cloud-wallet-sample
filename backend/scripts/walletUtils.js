const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// ファイル保存用ディレクトリのパスを設定（カレントディレクトリの一つ上の階層にあるdataディレクトリ）
const saveDirectory = path.join(__dirname, '..', 'data');
if (!fs.existsSync(saveDirectory)) {
  fs.mkdirSync(saveDirectory, { recursive: true });
};

// ウォレットファイルのパスを設定（カレントディレクトリの一つ上の階層にあるdataディレクトリ内のwallet.jsonファイル）
const walletFilePath = path.join(__dirname, '..', 'data', 'wallet.json');

// ウォレットを生成し、ファイルに保存する関数
async function generateWallet(password) {
  try {
    // ファイルをチェックして、ウォレットが既に存在するかを確認
    if (fs.existsSync(walletFilePath)) {
      throw new Error('Wallet already exists');
    }

    // 新しいウォレットを生成
    const wallet = ethers.Wallet.createRandom();

    // Keystore JSONファイルを生成
    const keystoreJson = await wallet.encrypt(password);

    // パスワードとKeystore JSONを一緒に保存するオブジェクトを作成
    const walletData = {
      password: password,
      address: wallet.address,
      keystoreJson: keystoreJson,
    };

    // 外部ファイルに保存
    const filePath = path.join(saveDirectory, 'wallet.json');
    fs.writeFileSync(filePath, JSON.stringify(walletData, null, 2));

    return {
      address: wallet.address,
      keystoreJson: keystoreJson,
    };
  } catch (error) {
    throw new Error(`Failed to generate wallet: ${error.message}`);
  }
};

// ウォレットのアドレスとKeystore JSONを取得する非同期関数
async function getWalletInfo() {
  try {
    // ウォレットファイルが存在しない場合の処理
    if (!fs.existsSync(walletFilePath)) {
      console.warn('Wallet file not found. Returning null.');
      return null;
    }

    // ウォレットファイルの内容を読み込み、JSON形式で解析
    const walletData = JSON.parse(fs.readFileSync(walletFilePath, 'utf-8'));
    return {
      address: walletData.address,
      keystoreJson: walletData.keystoreJson,
    };
  } catch (error) {
    throw new Error(`Failed to get wallet info: ${error.message}`);
  }
};

// ウォレットを取得する非同期関数
async function getWallet() {
  try {
    // ウォレットファイルが存在しない場合の処理
    if (!fs.existsSync(walletFilePath)) {
      console.warn('Wallet file not found. Returning null.');
      return null;
    }

    // ウォレットファイルの内容を読み込み、JSON形式で解析
    const walletData = JSON.parse(fs.readFileSync(walletFilePath, 'utf-8'));
    const password = walletData.password;
    const keystoreJson = walletData.keystoreJson;

    // Keystore JSONからウォレットを復元
    const wallet = await ethers.Wallet.fromEncryptedJson(keystoreJson, password);
    return wallet; // ウォレットオブジェクトを返却
  } catch (error) {
    throw new Error(`Failed to decrypt the wallet: ${error.message}`);
  }
};

module.exports = {
  generateWallet,
  getWalletInfo,
  getWallet,
};
