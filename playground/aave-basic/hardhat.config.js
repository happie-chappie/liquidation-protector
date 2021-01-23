require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

module.exports = {
  solidity: "0.7.0",
  networks: {
    hardhat: {
      forking: {
	url: process.env.FORKING_URL,
	blockNumber: 11701923
      },
      gas: 95000000,
      blockGasLimit: 95000000
    }
  },
  paths: {
    artifacts: "./app/artifacts",
  },
  mocha: {
    timeout: 2000000
  },
}
