import React, { useState, useCallback, useEffect } from 'react';
import { getMarketplaceInstance, getTokenInstance } from '../services/contractService';
import { ethers } from 'ethers';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const Marketplace = () => {
    const [orders, setOrders] = useState({ buy: [], sell: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [account, setAccount] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [userReputation, setUserReputation] = useState({ total: 0, successful: 0 });
    const [amountToList, setAmountToList] = useState('');
    const [pricePerToken, setPricePerToken] = useState('');
    const [orderType, setOrderType] = useState('buy');
    const [mintAmount, setMintAmount] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [tokenBalance, setTokenBalance] = useState('0');
    const { toast } = useToast();

    const loadUserReputation = useCallback(async () => {
        if (account) {
            const contract = await getMarketplaceInstance();
            const [total, successful] = await contract.getUserReputation(account);
            setUserReputation({ total: total.toNumber(), successful: successful.toNumber() });
        }
    }, [account]);

    const checkAdminStatus = useCallback(async () => {
        if (account) {
            try {
                const tokenContract = await getTokenInstance();
                const adminRole = await tokenContract.DEFAULT_ADMIN_ROLE();
                const isAdminUser = await tokenContract.hasRole(adminRole, account);
                setIsAdmin(isAdminUser);
            } catch (error) {
                console.error("Error checking admin status:", error);
                setIsAdmin(false);
            }
        }
    }, [account]);

    const loadTokenBalance = useCallback(async () => {
        if (account) {
            try {
                const tokenContract = await getTokenInstance();
                const balance = await tokenContract.balanceOf(account);
                setTokenBalance(ethers.utils.formatUnits(balance, 18));
            } catch (error) {
                console.error("Error loading token balance:", error);
            }
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
            await checkAdminStatus();
            await loadTokenBalance();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [loadUserReputation, checkAdminStatus, loadTokenBalance]);

    useEffect(() => {
        if (account) {
            loadMarketData();
        }
    }, [account, refreshKey, loadMarketData]);

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
            toast({
                title: "MetaMask Not Found",
                description: "Please install MetaMask to use this application.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);

        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);
            toast({
                title: "Wallet Connected",
                description: "Your wallet has been successfully connected.",
            });
        } catch (error) {
            setError('Failed to connect to wallet. Please try again.');
            toast({
                title: "Connection Failed",
                description: "Failed to connect to wallet. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrder = async () => {
        try {
            const contract = await getMarketplaceInstance();
            const amount = ethers.utils.parseUnits(amountToList, 18);
            const price = ethers.utils.parseEther(pricePerToken);

            if (orderType === 'buy') {
                const totalCost = amount.mul(price);
                const tx = await contract.createLimitOrder(amount, price, true, { value: totalCost });
                await tx.wait();
            } else {
                const tokenContract = await getTokenInstance();
                await tokenContract.approve(contract.address, amount);
                const tx = await contract.createLimitOrder(amount, price, false);
                await tx.wait();
            }

            toast({
                title: "Order Created",
                description: "Your order has been created successfully!",
            });
            refreshMarketplace();
            setAmountToList('');
            setPricePerToken('');
        } catch (error) {
            console.error('Failed to create order:', error);
            toast({
                title: "Order Creation Failed",
                description: "Failed to create order. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            const contract = await getMarketplaceInstance();
            const tx = await contract.cancelOrder(orderId);
            await tx.wait();
            toast({
                title: "Order Cancelled",
                description: "Your order has been cancelled successfully!",
            });
            refreshMarketplace();
        } catch (error) {
            toast({
                title: "Cancellation Failed",
                description: "Failed to cancel order. Please try again.",
                variant: "destructive",
            });
            console.error(error);
        }
    };

    const handleMintTokens = async () => {
        try {
            const tokenContract = await getTokenInstance();
            const amount = ethers.utils.parseUnits(mintAmount, 18);
            const tx = await tokenContract.mint(account, amount);
            await tx.wait();
            toast({
                title: "Tokens Minted",
                description: `${mintAmount} tokens have been minted successfully!`,
            });
            setMintAmount('');
            refreshMarketplace();
        } catch (error) {
            toast({
                title: "Minting Failed",
                description: "Failed to mint tokens. Please try again.",
                variant: "destructive",
            });
            console.error(error);
        }
    };

    const disconnectWallet = () => {
        setAccount('');
        setUserReputation({ total: 0, successful: 0 });
        setIsAdmin(false);
        setTokenBalance('0');
        toast({
            title: "Wallet Disconnected",
            description: "Your wallet has been disconnected.",
        });
    };

    const refreshMarketplace = () => {
        setRefreshKey(oldKey => oldKey + 1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-8">
            <Card className="max-w-6xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-gray-800">Carbon Credit Marketplace</CardTitle>
                    <CardDescription>Trade carbon credits securely and efficiently</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                            <p>{error}</p>
                        </div>
                    )}
                    
                    <div className="flex justify-between items-center mb-6">
                        <Button
                            variant={account ? "outline" : "default"}
                            onClick={account ? disconnectWallet : connectWallet}
                            className="w-48"
                        >
                            {account ? `Disconnect Wallet` : 'Connect Wallet'}
                        </Button>
                        {account && (
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
                                <p className="text-sm text-gray-600">Balance: {tokenBalance} CCT</p>
                            </div>
                        )}
                    </div>

                    {account && (
                        <div className="mb-6 flex justify-between items-center">
                            <div>
                                <Badge variant={userReputation.successful / userReputation.total > 0.8 ? "success" : "warning"}>
                                    Reputation: {userReputation.successful} / {userReputation.total}
                                </Badge>
                                {isAdmin && <Badge variant="secondary" className="ml-2">Admin</Badge>}
                            </div>
                            <Button
                                variant="outline"
                                onClick={refreshMarketplace}
                                className="flex items-center"
                            >
                                <Loader2 className="mr-2 h-4 w-4" /> Refresh
                            </Button>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <Tabs defaultValue="orderbook">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="orderbook">Order Book</TabsTrigger>
                                <TabsTrigger value="createorder">Create Order</TabsTrigger>
                            </TabsList>
                            <TabsContent value="orderbook">
                                <div className="grid grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Buy Orders</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2 max-h-80 overflow-y-auto">
                                                {orders.buy.map((order) => (
                                                    <li key={order.id} className="p-3 bg-green-50 rounded-lg flex justify-between items-center">
                                                        <span>{order.amount} CCT @ {order.price} ETH</span>
                                                        {order.trader === account && (
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleCancelOrder(order.id)}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Sell Orders</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2 max-h-80 overflow-y-auto">
                                                {orders.sell.map((order) => (
                                                    <li key={order.id} className="p-3 bg-red-50 rounded-lg flex justify-between items-center">
                                                        <span>{order.amount} CCT @ {order.price} ETH</span>
                                                        {order.trader === account && (
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleCancelOrder(order.id)}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                            <TabsContent value="createorder">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Create New Order</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <Select value={orderType} onValueChange={(value) => setOrderType(value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select order type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="buy">Buy</SelectItem>
                                                    <SelectItem value="sell">Sell</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Input
                                                type="number"
                                                placeholder="Amount of CCT"
                                                value={amountToList}
                                                onChange={(e) => setAmountToList(e.target.value)}
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Price per token (ETH)"
                                                value={pricePerToken}
                                                onChange={(e) => setPricePerToken(e.target.value)}
                                            />
                                            <Button
                                                className="w-full"
                                                onClick={handleCreateOrder}
                                            >
                                                Create {orderType} Order
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    )}
                    
                    {account && isAdmin && (
                        <Card className="mt-8">
                            <CardHeader>
                                <CardTitle>Mint Tokens (Admin Only)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex space-x-4">
                                    <Input
                                        type="number"
                                        placeholder="Amount to mint"
                                        value={mintAmount}
                                        onChange={(e) => setMintAmount(e.target.value)}
                                        className="flex-grow"
                                    />
                                    <Button
                                        onClick={handleMintTokens}
                                    >
                                        Mint Tokens
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Marketplace;