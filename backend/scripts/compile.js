const hre = require('hardhat');

// Hardhatを使用してスマートコントラクトをコンパイルする関数
async function compileContracts() {
  try {
    console.log('Starting compilation...');

    // Hardhatが提供する 'compile' タスクを実行
    await hre.run('compile');

    console.log('Contracts compiled successfully.');
  } catch (error) {
    throw new Error(`Failed to compile contract: ${error.message}`);
  }
};

module.exports = {
  compileContracts,
};
