const { task } = require('hardhat/config');
const hre = require('hardhat');

async function compileContracts() {
  try {
    console.log('Starting compilation...');
    await hre.run('compile');
    console.log('Contracts compiled successfully.');
  } catch (error) {
    console.error('Error during compilation:', error);
  }
};

module.exports = {
  compileContracts,
};
