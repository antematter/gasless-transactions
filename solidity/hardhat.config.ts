import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    prod: {
      accounts: [process.env.FORWARDER_PRIVATE_KEY as string],
      url: process.env.PROD_RPC_URL,
    },
  },
};

export default config;
