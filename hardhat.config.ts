import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-waffle";
import { ENV } from "./env.config";

const config: HardhatUserConfig = {
  solidity: "0.8.15",
  networks: {
    goerli: { // to deploy on this network: npx hardhat run scripts/deploy.ts --network goerli (and etc for other networks if we add anymore)
      url: ENV.GOERLI_URL,
      accounts: [ENV.PRIVATE_KEY]
    }
  }
};

export default config;
