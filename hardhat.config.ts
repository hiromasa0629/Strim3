import { HardhatUserConfig } from "hardhat/config";
import dotenv from 'dotenv';
import "@nomicfoundation/hardhat-toolbox";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.18",
	paths: {
    artifacts: "./app/artifacts",
  },
	defaultNetwork: "localhost",
	networks: {
		sepolia: {
			url: process.env.ALCHEMY_SEPOLIA_URL,
			accounts: [process.env.SEPOLIA_PRIVATE_KEY!]
		}
	},
	etherscan: {
		apiKey: process.env.ETHERSCAN_API_KEY
	}
};

export default config;
