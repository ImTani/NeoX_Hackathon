# Carbon Credit Marketplace

## Project Vision

Our vision is to create a decentralized, transparent, and efficient marketplace for carbon credits, leveraging blockchain technology to drive global sustainability efforts. By tokenizing carbon credits and providing a user-friendly platform for trading, we aim to increase accessibility and liquidity in the carbon offset market, ultimately contributing to the fight against climate change.

## Overview

The Carbon Credit Marketplace is a decentralized application (DApp) built on the Neo X blockchain, utilizing smart contracts to facilitate the trading of carbon credits. This platform promotes sustainability by creating a transparent and efficient market for carbon offset trading.

## Features

- **Tokenized Carbon Credits**: Carbon credits are represented as ERC20 tokens (CCT - CarbonCredit Token).
- **Decentralized Order Book**: Users can create buy and sell orders for carbon credits.
- **User Reputation System**: Tracks user trading history to build trust in the marketplace.
- **Admin Functions**: Privileged users can mint new carbon credit tokens.
- **Responsive UI**: Built with React and styled using Tailwind CSS for a modern, mobile-friendly interface.
- **Real-time Market Data**: Live updates of order book and user balances.
- **Seamless Web3 Integration**: Easy connection with MetaMask and other Web3 wallets.

## Tech Stack

- **Blockchain**: Neo X (compatible with Ethereum)
- **Smart Contracts**: Solidity
- **Frontend**: React.js
- **Styling**: Tailwind CSS
- **Web3 Integration**: ethers.js

## Smart Contracts

1. **CarbonCreditToken.sol**: ERC20 token representing carbon credits.
2. **CarbonMarketplace.sol**: Handles the order book and trade execution.

## Components

1. **LandingPage.js**: The main entry point of the application, showcasing key features and statistics.
2. **Marketplace.js**: The core component for interacting with the carbon credit marketplace.

## Deployment Details

### Smart Contracts
- Network: NeoX T4 Testnet

### Frontend
- Hosting: Local
- CI/CD: GitHub Actions

## Demo

Check out our demo video to see the Carbon Credit Marketplace in action:
[Demo Video Link](https://youtu.be/xGx22Btn8-w)

## Setup d Installation

1. Clone the repository:
   ```
   git clone [repository-url]
   cd carbon-credit-marketplace
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   REACT_APP_CONTRACT_ADDRESS=[deployed-marketplace-contract-address]
   REACT_APP_TOKEN_ADDRESS=[deployed-token-contract-address]
   ```

4. Start the development server:
   ```
   npm start
   ```

## Usage

1. Connect your Web3 wallet (e.g., MetaMask) to the application.
2. Ensure you have some CCT tokens and ETH for trading.
3. Navigate to the Marketplace tab to view the order book.
4. Create buy or sell orders for carbon credits.
5. Cancel your own orders if needed.
6. Admin users can mint new CCT tokens from the admin panel.

## Contributing

We welcome contributions to the Carbon Credit Marketplace! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Team Contact Information

- **Project Lead**: Ved Mohan - vedmohan0@gmail.com
- **Resource Manager**: Ved Mohan - vedmohan0@gmail.com
- **Lead Developer**: Tanishk Narula - tanidev69@gmail.com
- **Blockchain Specialist**: Tanishk Narula - tanidev69@gmail.com
- **Bridging Implementation**: Ved Mohan - vedmohan0@gmail.com
- **UI Designer**: Sarthak Kakar - sarthak.kakar1234@gmail.com
- **UI/UX Developer**: Tanishk Narula - tanidev69@gmail.com
- **Tester/Debugger**: Aditya Jha - adityajha2006714@gmail.com

---

Join us in our mission to create a more sustainable future through efficient carbon credit trading!