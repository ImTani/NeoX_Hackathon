// src/services/contractService.js
import CarbonCreditMarketplace from '../artifacts/CarbonMarketplace.json'; // Adjust the path as necessary

const { ethers } = require("ethers");
const marketplaceAddress = '0x676066a716C741432dD52a789c6F9DC44d7C17E4'; // Replace with your deployed contract address

export const getMarketplaceInstance = async () => {
    // Create a provider from the window's Ethereum object
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // Request account access
    await provider.send("eth_requestAccounts", []);
    
    // Get the signer which allows you to send transactions
    const signer = await provider.getSigner();
    
    // Create the marketplace contract instance
    const marketplaceContract = new ethers.Contract(marketplaceAddress, CarbonCreditMarketplace.abi, signer);
    
    return marketplaceContract;
};

export const fetchAvailableCredits = async () => {
    const contract = await getMarketplaceInstance();
    const nextListingId = await contract.nextListingId(); // Get the next listing ID
    const creditsList = [];

    for (let i = 0; i < nextListingId; i++) {
        const listing = await contract.listings(i); // Fetch listing by ID
        if (listing.amount > 0) {
            creditsList.push({
                id: i,
                amount: listing.amount.toString(),
                pricePerToken: ethers.utils.formatEther(listing.pricePerToken), // Convert price from wei to ether
                seller: listing.seller
            });
        }
    }

    return creditsList;
};