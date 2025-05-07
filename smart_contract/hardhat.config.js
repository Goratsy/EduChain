require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    development: {
      url: "http://localhost:7545",
      chainId: Number(process.env.CHAIN_ID),
    }
  }
};