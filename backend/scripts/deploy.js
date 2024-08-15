require('dotenv').config();
const { ethers } = require('hardhat');
const { getWallet } = require('./walletUtils');
const { saveContractInfo, getContractInfo } = require('./contractUtils');

// プロバイダーURLの設定（環境変数からInfuraのAPIキーを取得）
const providerUrl = `https://polygon-amoy.infura.io/v3/${process.env.INFURA_API_KEY}`;

// コントラクトをデプロイする非同期関数
async function deployContract() {
  try {
    // コントラクトがすでにデプロイされているかどうかを確認
    const existingContract = await getContractInfo();
    if (existingContract) {
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

    // コントラクトアドレスとトランザクションハッシュ、ABIを保存
    saveContractInfo(contractData);

    return contractData;
  } catch (error) {
    throw new Error(`Failed to deploy contract: ${error.message}`);
  }
};

module.exports = {
  deployContract,
};
