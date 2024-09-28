// src/services/contractService.js
import CarbonCreditMarketplace from '../artifacts/CarbonMarketplace.json';
import CarbonCreditToken from '../artifacts/CarbonCreditToken.json';
import { ethers } from 'ethers';

const marketplaceAddress = '0xfD61A577e26059606DcB087bEb952500672d7DB8'; // Replace with your deployed contract address

export const getMarketplaceInstance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
  
    return new ethers.Contract(marketplaceAddress, CarbonCreditMarketplace.abi, signer);
};

export const getTokenInstance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
  
    const tokenAddress = await (await getMarketplaceInstance()).carbonToken();
    return new ethers.Contract(tokenAddress, CarbonCreditToken.abi, signer);
};

export const fetchAvailableCredits = async () => {
    const contract = await getMarketplaceInstance();
    const nextOrderId = await contract.nextOrderId();
    const creditsList = [];

    for (let i = 0; i < nextOrderId; i++) {
        const [amount, price, trader, isBuyOrder] = await contract.getOrderDetails(i);
        if (amount.gt(0) && !isBuyOrder) {
            creditsList.push({
                id: i,
                amount: amount.toString(),
                pricePerToken: ethers.utils.formatEther(price),
                seller: trader
            });
        }
    }

    return creditsList;
};


export const createLimitOrder = async (amount, price, isBuyOrder) => {
    console.log(`Creating limit order: amount=${amount}, price=${price}, isBuyOrder=${isBuyOrder}`);
    const contract = await getMarketplaceInstance();
    const parsedAmount = ethers.utils.parseUnits(amount, 18);
    const parsedPrice = ethers.utils.parseEther(price);

    if (isBuyOrder) {
        const totalCost = parsedAmount.mul(parsedPrice);
        console.log(`Total cost: ${ethers.utils.formatEther(totalCost)}`);
        console.log(`Calling createLimitOrder with totalCost=${totalCost}`);
        return await contract.createLimitOrder(parsedAmount, parsedPrice, true, { value: totalCost });
    } else {
        const tokenContract = await getTokenInstance();
        console.log(`Approving token contract: ${tokenContract.address}`);
        await tokenContract.approve(contract.address, parsedAmount);
        return await contract.createLimitOrder(parsedAmount, parsedPrice, false);
    }
};

export const cancelOrder = async (orderId) => {
    const contract = await getMarketplaceInstance();
    return await contract.cancelOrder(orderId);
};

export const getUserReputation = async (address) => {
    const contract = await getMarketplaceInstance();
    return await contract.getUserReputation(address);
};