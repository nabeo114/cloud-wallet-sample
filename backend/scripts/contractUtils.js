const fs = require('fs');
const path = require('path');

// コントラクト情報を保存するディレクトリのパス
// ディレクトリが存在しない場合は作成する
const saveDirectory = path.join(__dirname, '..', 'data');
if (!fs.existsSync(saveDirectory)) {
  fs.mkdirSync(saveDirectory, { recursive: true });
}

// コントラクト情報を保存する非同期関数
async function saveContractInfo(contractName, contractData) {
  try {
    const filePath = path.join(saveDirectory, `${contractName}.json`);
    // コントラクト情報を指定したパスに保存
    await fs.promises.writeFile(filePath, JSON.stringify(contractData, null, 2));
  } catch (error) {
    throw new Error(`Failed to save contract info: ${error.message}`);
  }
}

// コントラクト情報を取得する非同期関数
async function getContractInfo(contractName) {
  try {
    const filePath = path.join(saveDirectory, `${contractName}.json`);
    // コントラクト情報ファイルが存在しない場合の処理
    if (!fs.existsSync(filePath)) {
      console.warn('Contract info file not found. Returning null.');
      return null;
    }

    // コントラクト情報ファイルの内容を読み込み、JSON形式で解析
    const contractData = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));
    return contractData;
  } catch (error) {
    throw new Error(`Failed to get contract info: ${error.message}`);
  }
}

module.exports = {
  saveContractInfo,
  getContractInfo,
};
