require("dotenv").config(); // Load environment variables

require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    neox_testnet: {
      url: "https://neoxt4seed1.ngd.network",
      chainId: 12227332,
      accounts: [process.env.PRIVATE_KEY], // Use private key from environment variable
      gas: "auto",
      gasPrice: 20000000000,
    }
  },
};
