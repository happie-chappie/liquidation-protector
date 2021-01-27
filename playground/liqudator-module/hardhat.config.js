require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const ROPSTEN_PRIVATE_KEY = process.env.ROPSTEN_PRIVATE_KEY;

module.exports = {
  solidity: "0.7.5",
  networks: {
    hardhat: {
      forking: {
	url: process.env.FORKING_URL,
	blockNumber: 11701923
      },
      gas: 95000000,
      blockGasLimit: 95000000
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${ROPSTEN_PRIVATE_KEY}`]
    }
  },
  paths: {
    artifacts: "./app/artifacts",
  },
  mocha: {
    timeout: 2000000
  },
}
