const { ethers } = require('hardhat');
const { getWallet } = require('./walletUtils');
const { getContractInfo } = require('./contractUtils');

// プロバイダーURLの設定（環境変数からInfuraのAPIキーを取得）
const providerUrl = `https://polygon-amoy.infura.io/v3/${process.env.INFURA_API_KEY}`;

// コントラクトオブジェクトを生成する非同期関数
async function createContract(contractName) {
  try {
    // コントラクト情報の取得
    const contractData = await getContractInfo(contractName);
    if (!contractData) {
      throw new Error('Contract not deployed');
    }

    // ウォレットの取得
    const wallet = await getWallet();

    // プロバイダーの設定
    const provider = new ethers.JsonRpcProvider(providerUrl);

    // ウォレットにプロバイダーを接続
    const walletWithProvider = wallet.connect(provider);

    // コントラクトオブジェクトを生成
    const contract = new ethers.Contract(contractData.contractAddress, contractData.abi, walletWithProvider);

    // コントラクトとウォレットの両方を返却
    return { contract, walletWithProvider };
  } catch (error) {
    throw new Error(`Failed to create contract: ${error.message}`);
  }
}

// トークンを転送する非同期関数
async function transferTokens(recipientAddress, transferAmount) {
  try {
    // コントラクトオブジェクトとウォレットを生成
    const { contract } = await createContract('MyToken');

    // トークンを転送（コントラクトのメソッドを実行）
//    const txReceipt = await contract.transfer(recipientAddress, ethers.utils.parseUnits(transferAmount, 'ether'));
    const tx = await contract.transfer(recipientAddress, transferAmount);

    // トランザクションの確認
    await tx.wait();

    console.log(`Transferred ${transferAmount} tokens to ${recipientAddress}`);
    console.log(`Transaction hash: ${tx.hash}`);

    return tx.hash;
  } catch (error) {
    throw new Error(`Failed to transfer tokens: ${error.message}`);
  }
}

// NFTをミントする非同期関数
async function mintNFT(recipientAddress) {
  try {
    // コントラクトオブジェクトとウォレットを生成
    const { contract } = await createContract('MyNFT');

    // NFTをミント（コントラクトのメソッドを実行）
    const tx = await contract.safeMint(recipientAddress);

    // トランザクションの確認
    await tx.wait();

    console.log(`Minted NFT to ${recipientAddress}`);
    console.log(`Transaction hash: ${tx.hash}`);

    return tx.hash;
  } catch (error) {
    throw new Error(`Failed to mint NFT: ${error.message}`);
  }
}

// NFTを転送する非同期関数
async function transferNFT(recipientAddress, tokenId) {
  try {
    // コントラクトオブジェクトとウォレットを生成
    const { contract, walletWithProvider } = await createContract('MyNFT');

    // メソッドを実行するプロバイダーのアドレス（送信者）を取得
    const senderAddress = await walletWithProvider.getAddress();

    // NFTを転送（コントラクトのメソッドを実行）
    const tx = await contract.safeTransferFrom(senderAddress, recipientAddress, tokenId);

    // トランザクションの確認
    await tx.wait();

    console.log(`Transferred NFT to ${recipientAddress}`);
    console.log(`Transaction hash: ${tx.hash}`);

    return tx.hash;
  } catch (error) {
    throw new Error(`Failed to transfer NFT: ${error.message}`);
  }
}

module.exports = {
  transferTokens,
  mintNFT,
  transferNFT,
};
