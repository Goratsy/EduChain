require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    development: {
      url: process.env.URL_GANACHE,
      chainId: Number(process.env.CHAIN_ID),
    }
  }
};