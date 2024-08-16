const fs = require('fs');
const path = require('path');

// 動的にNFTメタデータを生成する非同期関数
async function generateNFTMetadata(tokenId) {
  try {
    // 引数 tokenId が string の場合、BigInt に変換する
    if (typeof tokenId === 'string') {
      tokenId = BigInt(tokenId);
    }
    // tokenId が BigInt であり、非負整数であるかをチェック
    if (typeof tokenId !== 'bigint' || tokenId < 0n) {
      throw new Error('Invalid tokenId: tokenId must be a non-negative BigInt.');
    }

    // 画像ファイルのパスを設定（assetsディレクトリ内のファイル）
//    const imageFilePath = path.join(__dirname, '..', 'assets', `${tokenId}.png`);
    const imageFilePath = path.join(__dirname, '..', 'assets', '0.png');

    // 画像ファイルが存在しない場合の処理
    if (!fs.existsSync(imageFilePath)) {
      console.warn('Image file not found. Returning null.');
      return null;
    }

    // 動的に生成されたJSONデータを返す
    const metadata = {
      name: `Sample NFT #${tokenId}`,
      description: "This is a sample NFT for demonstration purposes. It showcases the basic structure of an NFT's metadata, including a sample image and descriptive text.",
//      image: `http://localhost:5000/assets/image/${tokenId}.png`,
      image: 'http://localhost:5000/assets/image/0.png',
    };

    return metadata;
  } catch (error) {
    throw new Error(`Failed to generate NFT metadata: ${error.message}`);
  }
};

// 動的にNFT画像を生成する非同期関数
async function generateNFTImage(imageFile) {
  try {
    // 画像ファイルのパスを設定（assetsディレクトリ内のファイル）
    const imageFilePath = path.join(__dirname, '..', 'assets', `${imageFile}`);

    // 画像ファイルが存在しない場合の処理
    if (!fs.existsSync(imageFilePath)) {
      console.warn('Image file not found. Returning null.');
      return null;
    }

    // 画像ファイルを読み込み
    const imageData = await fs.promises.readFile(imageFilePath)

    return imageData;
  } catch (error) {
    throw new Error(`Failed to generate NFT metadata: ${error.message}`);
  }
}

module.exports = {
  generateNFTMetadata,
  generateNFTImage,
};

