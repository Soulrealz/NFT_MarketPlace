import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "dotenv/config"

const INFURA_ENDPOINT = process.env.INFURA_ENDPOINT;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const etherscanKey = process.env.ETHERSCAN_API_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    hardhat: {chainId: 1337},
    goerli: {
      url: INFURA_ENDPOINT,
      accounts: [`${PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: etherscanKey
  }  
};

export default config;
