const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

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
    const imageFilePath = path.join(__dirname, '..', 'assets', 'image.png');

    // 画像ファイルが存在しない場合の処理
    if (!fs.existsSync(imageFilePath)) {
      console.warn('Image file not found. Returning null.');
      return null;
    }

    // 動的に生成されたJSONデータを返す
    const metadata = {
      name: `Sample NFT #${tokenId}`,
      description: "This is a sample NFT for demonstration purposes. It showcases the basic structure of an NFT's metadata, including a sample image and descriptive text.",
      image: `http://localhost:5000/assets/image/${tokenId}.png`,
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
    const imageFilePath = path.join(__dirname, '..', 'assets', 'image.png');

    // 画像ファイルが存在しない場合の処理
    if (!fs.existsSync(imageFilePath)) {
      console.warn('Image file not found. Returning null.');
      return null;
    }

    // 画像ファイルを読み込み
    const image = sharp(imageFilePath);
    const { width, height } = await image.metadata();

    // ウォーターマーク用のSVGテキストを作成
    const svgText = `
      <svg width="${width}" height="${height}">
        <text x="50%" y="50%"
              font-size="128"
              font-family="Arial"
              fill="white"
              fill-opacity="0.2"
              text-anchor="middle"
              alignment-baseline="middle">${imageFile}</text>
      </svg>`;

    // SVGテキストをバッファに変換
    const watermark = Buffer.from(svgText);

    // 画像にウォーターマークを合成
    const watermarkedImage = await image
      .composite([{ input: watermark, gravity: 'center' }])  // ウォーターマークを中央に配置
      .png()  // PNG形式で画像を出力
      .toBuffer();  // 画像をバッファに変換して返す

    return watermarkedImage;
  } catch (error) {
    throw new Error(`Failed to generate NFT image: ${error.message}`);
  }
}

module.exports = {
  generateNFTMetadata,
  generateNFTImage,
};

