const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    const balance = await deployer.getBalance();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", ethers.utils.formatEther(balance), "ETH");

    const gasPrice = await ethers.provider.getGasPrice(); // Get current gas price
    console.log("Current gas price:", ethers.utils.formatUnits(gasPrice, 'gwei'), "gwei");

    console.log("Gas price set to:", gasPrice.toString());

    // Getting contract factory for CarbonCreditToken
    const CarbonCreditToken = await ethers.getContractFactory("CarbonCreditToken");
    const token = await CarbonCreditToken.deploy(1000000, { gasPrice });
    await token.deployed();
    console.log("CarbonCreditToken deployed to:", token.address);

    // Getting contract factory for CarbonMarketplace
    const CarbonMarketplace = await ethers.getContractFactory("CarbonMarketplace");
    const marketplace = await CarbonMarketplace.deploy(token.address, { gasPrice });
    await marketplace.deployed();
    console.log("CarbonMarketplace deployed to:", marketplace.address);

    // Getting contract factory for Governance
    const Governance = await ethers.getContractFactory("Governance");
    const governance = await Governance.deploy(token.address, { gasPrice });
    await governance.deployed();
    console.log("Governance deployed to:", governance.address);
}

main().catch((error) => {
    console.error("Error during deployment:", error);
    process.exitCode = 1;
});
