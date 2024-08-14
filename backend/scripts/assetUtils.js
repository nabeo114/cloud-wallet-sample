const fs = require('fs');
const path = require('path');

// コントラクトアドレスとトランザクションハッシュ、ABIを取得する非同期関数
async function getAssetInfo(tokenId) {
  try {
    // アセットファイルのパスを設定（カレントディレクトリの一つ上の階層にあるassetsディレクトリ内のファイル）
    const assetFilePath = path.join(__dirname, '..', 'assets', tokenId);

    // アセットファイルが存在しない場合の処理
    if (!fs.existsSync(assetFilePath)) {
      console.warn('Asset file not found. Returning null.');
      return null;
    }

    // アセットファイルの内容を読み込み、JSON形式で解析
    const assetData = JSON.parse(fs.readFileSync(assetFilePath, 'utf-8'));
    return assetData;
  } catch (error) {
    throw new Error(`Failed to get asset info: ${error.message}`);
  }
};

module.exports = {
  getAssetInfo,
};

