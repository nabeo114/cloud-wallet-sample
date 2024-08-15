require('dotenv').config();
const { ethers } = require('hardhat');
const { getWallet } = require('./walletUtils');
const { saveContractInfo, getContractInfo } = require('./contractUtils');

// プロバイダーURLの設定（環境変数からInfuraのAPIキーを取得）
const providerUrl = `https://polygon-amoy.infura.io/v3/${process.env.INFURA_API_KEY}`;

// コントラクトをデプロイする非同期関数
async function deployContract(contractName, constructorArgs = []) {
  try {
    // コントラクトがすでにデプロイされているかどうかを確認
    const existingContract = await getContractInfo(contractName);
    if (existingContract) {
      throw new Error(`${contractName} contract already deployed`);
    }

    console.log(`Starting deployment of ${contractName}...`);

    // ウォレットの取得
    const wallet = await getWallet();
    if (!wallet) {
      return null;
    }

    // プロバイダーの設定
    const provider = new ethers.JsonRpcProvider(providerUrl);
    const walletWithProvider = wallet.connect(provider);

    // コントラクトをデプロイ
    const myToken = await ethers.deployContract(contractName, constructorArgs, walletWithProvider);
    console.log('Contract deployment transaction sent.');

    // デプロイ完了まで待機
    await myToken.waitForDeployment();
    console.log('Contract deployed.');

    // トランザクションレシートを取得
    const txReceipt = await myToken.deploymentTransaction().wait();
    // ABIの取得
    const contractABI = myToken.interface.formatJson();

    console.log(`Contract deployed at address: ${txReceipt.contractAddress}`);
    console.log(`Transaction hash: ${txReceipt.hash}`);

    const contractData = {
      contractAddress: txReceipt.contractAddress,
      transactionHash: txReceipt.hash,
      abi: contractABI,
    };

    // コントラクト情報の保存
    await saveContractInfo(contractName, contractData);

    return contractData;
  } catch (error) {
    throw new Error(`Failed to deploy ${contractName} contract: ${error.message}`);
  }
};

module.exports = {
  deployContract,
};
