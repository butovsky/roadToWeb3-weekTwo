import * as hardhat from 'hardhat';
import abi from '../artifacts/contracts/BuyMeABeer.sol/BuyMeABeer.json';
import { ENV } from '../env.config';
import { DeployedContracts, DeployedContractsType } from "./types";
import { getSigner } from './utils';

async function main() {
    const contractAddress = ENV.BEER_CONTRACT_ADDRESS;
    const contractAbi = abi.abi;

    const buyMeABeer = new hardhat.ethers.Contract(contractAddress, contractAbi, await getSigner());

    const contractBalance = await buyMeABeer.checkTips();
    console.log(`Contract balance is: ${hardhat.ethers.utils.formatEther(contractBalance)}`);
    await buyMeABeer.withdraw(contractBalance);
}
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });