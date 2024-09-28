// src/components/Marketplace.js
import React, { useEffect, useState } from 'react';
import { fetchAvailableCredits, getMarketplaceInstance } from '../services/contractService';

const { ethers } = require("ethers");

const Marketplace = () => {
    const [credits, setCredits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [account, setAccount] = useState('');

    const loadCredits = async () => {
        setLoading(true);
        try {
            if (!window.ethereum) {
                throw new Error('Ethereum provider not found. Please install MetaMask.');
            }
            
            const creditsList = await fetchAvailableCredits();
            console.log('Credits fetched:', creditsList); // Log fetched credits
            setCredits(creditsList);
        } catch (error) {
            console.error('Error fetching credits:', error);
            alert(error.message); // Show the error message
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCredits();
    }, []);
    
    const connectWallet = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            alert('Please install MetaMask!');
            return;
        }

        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);
            console.log('Wallet connected:', accounts[0]);
            await loadCredits(); // Call loadCredits again to refresh credits after wallet connection
        } catch (error) {
            console.error('Error connecting to wallet:', error);
            setError('Failed to connect to wallet. Please try again.');
        }
    };

    const handleBuy = async (listingId, pricePerToken) => {
        const contract = await getMarketplaceInstance(); // Ensure you have this function available
        const value = ethers.utils.parseEther(pricePerToken); // Ensure the price is in wei
        try {
            const transaction = await contract.buyTokens(listingId, { value }); // Sending the value with the transaction
            await transaction.wait(); // Wait for transaction to be mined
            alert('Purchase successful!');
            loadCredits(); // Reload credits after purchase
        } catch (error) {
            console.error('Error buying tokens:', error);
            alert('Transaction failed. Please try again.');
        }
    };

    const disconnectWallet = () => {
        setAccount('');
        setCredits([]); // Optionally clear credits when disconnecting
        alert('Wallet disconnected.');
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Carbon Credit Marketplace</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={connectWallet} style={{ marginBottom: '10px' }}>
                {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
            </button>
            {account && <button onClick={disconnectWallet} style={{ marginLeft: '10px' }}>Logout</button>}
            {loading ? (
                <p>Loading credits...</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {credits.length === 0 ? (
                        <p>No available credits at the moment.</p>
                    ) : (
                        credits.map((credit) => (
                            <li key={credit.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                                <h3>Listing ID: {credit.id}</h3>
                                <p>Amount: {credit.amount} CCT</p>
                                <p>Price: {credit.pricePerToken} ETH</p> {/* Show price in ETH */}
                                <button onClick={() => handleBuy(credit.id, credit.pricePerToken)}>Buy</button>
                                <button>Sell</button> {/* Placeholder for sell functionality */}
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};

export default Marketplace;
