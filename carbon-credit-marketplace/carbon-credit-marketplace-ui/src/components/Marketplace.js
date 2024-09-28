import React, { useState, useCallback } from 'react';
import { getMarketplaceInstance, getTokenInstance } from '../services/contractService';
import { ethers } from 'ethers';

const Marketplace = () => {
    const [orders, setOrders] = useState({ buy: [], sell: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [account, setAccount] = useState('');
    const [userReputation, setUserReputation] = useState({ total: 0, successful: 0 });
    const [amountToList, setAmountToList] = useState('');
    const [pricePerToken, setPricePerToken] = useState('');
    const [orderType, setOrderType] = useState('buy');
    const [mintAmount, setMintAmount] = useState(''); // State for minting

    const loadUserReputation = useCallback(async () => {
        if (account) {
            const contract = await getMarketplaceInstance();
            const [total, successful] = await contract.getUserReputation(account);
            setUserReputation({ total: total.toNumber(), successful: successful.toNumber() });
        }
    }, [account]);

    const loadMarketData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            if (!window.ethereum) {
                throw new Error('Ethereum provider not found. Please install MetaMask.');
            }
            await loadOrderBook();
            await loadUserReputation();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [loadUserReputation]);

    const loadOrderBook = async () => {
        const contract = await getMarketplaceInstance();
        const buyOrders = [];
        const sellOrders = [];
        const nextOrderId = await contract.nextOrderId();

        for (let i = 0; i < nextOrderId; i++) {
            const [amount, price, trader, isBuyOrder] = await contract.getOrderDetails(i);
            if (amount.gt(0)) {
                const order = {
                    id: i,
                    amount: ethers.utils.formatUnits(amount, 18),
                    price: ethers.utils.formatEther(price),
                    trader
                };
                if (isBuyOrder) {
                    buyOrders.push(order);
                } else {
                    sellOrders.push(order);
                }
            }
        }

        setOrders({ buy: buyOrders, sell: sellOrders });
    };

    const connectWallet = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            alert('Please install MetaMask!');
            return;
        }

        setLoading(true);

        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);
        } catch (error) {
            setError('Failed to connect to wallet. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrder = async () => {
        console.log('handleCreateOrder', amountToList, pricePerToken, orderType);
        try {
            const contract = await getMarketplaceInstance();
            const amount = ethers.utils.parseUnits(amountToList, 18);
            const price = ethers.utils.parseEther(pricePerToken);

            if (orderType === 'buy') {
                const totalCost = amount.mul(price);
                console.log('Total cost=', ethers.utils.formatEther(totalCost));
                console.log('Calling createLimitOrder');
                const tx = await contract.createLimitOrder(amount, price, true, { value: totalCost });
                await tx.wait();
            } else {
                const tokenContract = await getTokenInstance();
                console.log('Approving token contract=', tokenContract.address);
                await tokenContract.approve(contract.address, amount);
                console.log('Calling createLimitOrder');
                const tx = await contract.createLimitOrder(amount, price, false);
                await tx.wait();
            }

            alert('Order created successfully!');
            loadMarketData();
            setAmountToList('');
            setPricePerToken('');
        } catch (error) {
            console.error('Failed to create order:', error);
            alert('Failed to create order. Please try again.');
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            const contract = await getMarketplaceInstance();
            const tx = await contract.cancelOrder(orderId);
            await tx.wait();
            alert('Order cancelled successfully!');
            loadMarketData();
        } catch (error) {
            alert('Failed to cancel order. Please try again.');
            console.error(error);
        }
    };

    const handleMintTokens = async () => {
        try {
            const tokenContract = await getTokenInstance();
            const amount = ethers.utils.parseUnits(mintAmount, 18);
            const tx = await tokenContract.mint(account, amount);
            await tx.wait();
            alert(`${mintAmount} tokens minted successfully!`);
            setMintAmount(''); // Reset after minting
        } catch (error) {
            alert('Failed to mint tokens. Please try again.');
            console.error(error);
        }
    };

    const disconnectWallet = () => {
        setAccount('');
        setUserReputation({ total: 0, successful: 0 });
        alert('Wallet disconnected.');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-6xl w-full p-8 bg-white shadow-md rounded-lg">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Carbon Credit Marketplace</h1>
                
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <button
                    className="mb-4 px-6 py-2 bg-gray-800 text-white rounded-lg transition duration-200 hover:bg-gray-700"
                    onClick={connectWallet}
                >
                    {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
                </button>
                {account && (
                    <>
                        <button
                            className="mb-4 ml-4 px-6 py-2 bg-red-600 text-white rounded-lg transition duration-200 hover:bg-red-700"
                            onClick={disconnectWallet}
                        >
                            Logout
                        </button>
                        <div className="mb-4">
                            Reputation: {userReputation.successful} / {userReputation.total} successful transactions
                        </div>
                    </>
                )}
                {loading ? (
                    <div className="text-gray-500">Loading marketplace data...</div>
                ) : (
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Order Book</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Buy Orders</h3>
                                    <ul className="space-y-2">
                                        {orders.buy.map((order) => (
                                            <li key={order.id} className="p-2 bg-green-100 rounded">
                                                {order.amount} CCT @ {order.price} ETH
                                                {order.trader === account && (
                                                    <button
                                                        className="ml-2 text-sm text-red-600"
                                                        onClick={() => handleCancelOrder(order.id)}
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Sell Orders</h3>
                                    <ul className="space-y-2">
                                        {orders.sell.map((order) => (
                                            <li key={order.id} className="p-2 bg-red-100 rounded">
                                                {order.amount} CCT @ {order.price} ETH
                                                {order.trader === account && (
                                                    <button
                                                        className="ml-2 text-sm text-red-600"
                                                        onClick={() => handleCancelOrder(order.id)}
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Create Order</h2>
                            <div className="space-y-4">
                                <select
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={orderType}
                                    onChange={(e) => setOrderType(e.target.value)}
                                >
                                    <option value="buy">Buy</option>
                                    <option value="sell">Sell</option>
                                </select>
                                <input
                                    type="number"
                                    placeholder="Amount of CCT"
                                    value={amountToList}
                                    onChange={(e) => setAmountToList(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                                <input
                                    type="number"
                                    placeholder="Price per token (ETH)"
                                    value={pricePerToken}
                                    onChange={(e) => setPricePerToken(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                                <button
                                    className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg transition duration-200 hover:bg-blue-700"
                                    onClick={handleCreateOrder}
                                >
                                    Create {orderType} Order
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Minting Section */}
                {account && (
                    <div className="mt-8 p-4 bg-gray-50 rounded">
                        <h2 className="text-2xl font-semibold mb-4">Mint Tokens</h2>
                        <input
                            type="number"
                            placeholder="Amount to mint"
                            value={mintAmount}
                            onChange={(e) => setMintAmount(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                        />
                        <button
                            className="w-full px-6 py-2 bg-green-600 text-white rounded-lg transition duration-200 hover:bg-green-700"
                            onClick={handleMintTokens}
                        >
                            Mint Tokens
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Marketplace;
