const fs = require('fs');
const path = require('path');

// コントラクト情報を保存するディレクトリのパス
const saveDirectory = path.join(__dirname, '..', 'data');
if (!fs.existsSync(saveDirectory)) {
  fs.mkdirSync(saveDirectory, { recursive: true });
};

// コントラクト情報ファイルのパス
const contractFilePath = path.join(__dirname, '..', 'data', 'contract.json');

// コントラクト情報を保存する非同期関数
async function saveContractInfo(contractData) {
  try {
    await fs.promises.writeFile(contractFilePath, JSON.stringify(contractData, null, 2));
  } catch (error) {
    throw new Error(`Failed to save contract info: ${error.message}`);
  }
}

// コントラクト情報を取得する非同期関数
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
  saveContractInfo,
  getContractInfo,
};
