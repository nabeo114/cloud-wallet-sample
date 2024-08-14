require('dotenv').config();
const { ethers } = require('hardhat');
const { getWallet } = require('./walletUtils');
const fs = require('fs');
const path = require('path');

// プロバイダーURLの設定（環境変数からInfuraのAPIキーを取得）
const providerUrl = `https://polygon-amoy.infura.io/v3/${process.env.INFURA_API_KEY}`;

// ファイル保存用ディレクトリのパスを設定（カレントディレクトリの一つ上の階層にあるdataディレクトリ）
const saveDirectory = path.join(__dirname, '..', 'data');
if (!fs.existsSync(saveDirectory)) {
  fs.mkdirSync(saveDirectory, { recursive: true });
};

// コントラクト情報ファイルのパスを設定（カレントディレクトリの一つ上の階層にあるdataディレクトリ内のcontract.jsonファイル）
const contractFilePath = path.join(__dirname, '..', 'data', 'contract.json');

// コントラクトをデプロイする非同期関数
async function deployContract() {
  try {
    // コントラクトがすでにデプロイされているかどうかを確認
    if (fs.existsSync(contractFilePath)) {
      throw new Error('Contract already deployed');
    }

    console.log('Starting deployment...');

    // ウォレットの取得
    const wallet = await getWallet();
    if (!wallet) {
      return null;
    }

    // プロバイダーの設定
    const provider = new ethers.JsonRpcProvider(providerUrl);

    // ウォレットにプロバイダーを接続
    const walletWithProvider = wallet.connect(provider);

    // コントラクトをデプロイ
    const myToken = await ethers.deployContract('MyToken', [1000000], walletWithProvider);
    console.log('Contract deployment transaction sent.');

    // デプロイ完了まで待機
    await myToken.waitForDeployment();
    console.log('Contract deployed.');

    // トランザクションレシートを取得
    const txReceipt = await myToken.deploymentTransaction().wait();
    // ABIの取得
//    const contractABI = JSON.stringify(myToken.interface.fragments);
    const contractABI = myToken.interface.formatJson();

    console.log(`Contract deployed at address: ${txReceipt.contractAddress}`);
    console.log(`Transaction hash: ${txReceipt.hash}`);

    // コントラクトアドレスとトランザクションハッシュ、ABIを一緒に保存するオブジェクトを作成
    const contractData = {
      contractAddress: txReceipt.contractAddress,
      transactionHash: txReceipt.hash,
      abi: contractABI,
    };

    // コントラクト情報を外部ファイルに保存
    const filePath = path.join(saveDirectory, 'contract.json');
    fs.writeFileSync(filePath, JSON.stringify(contractData, null, 2));

    return contractData;
  } catch (error) {
    throw new Error(`Failed to deply contract: ${error.message}`);
  }
};

// コントラクトアドレスとトランザクションハッシュ、ABIを取得する非同期関数
async function getContractInfo() {
  try {
    // コントラクト情報ファイルが存在しない場合の処理
    if (!fs.existsSync(contractFilePath)) {
      console.warn('Contract info file not found. Returning null.');
      return null;
    }

    // コントラクト情報ファイルの内容を読み込み、JSON形式で解析
    const contractData = JSON.parse(fs.readFileSync(contractFilePath, 'utf-8'));
    return contractData;
  } catch (error) {
    throw new Error(`Failed to get contract info: ${error.message}`);
  }
};

module.exports = {
  deployContract,
  getContractInfo,
};
