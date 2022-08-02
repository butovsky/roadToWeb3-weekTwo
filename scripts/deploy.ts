import hardhat from 'hardhat';
import { DeployedContracts, DeployedContractsType } from './types';
import { getSigner } from './utils';

async function main(contractName: DeployedContractsType) {
    //const [owner, tipper, tipper1] = await hardhat.ethers.getSigners();
    await deploy(contractName);
  }
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main(DeployedContracts.BUY_ME_A_BEER).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });


export async function deploy (contractName: DeployedContractsType) {
    const contractFactory = await hardhat.ethers.getContractFactory(contractName, await getSigner());
    const contract = await contractFactory.deploy();
  
    await contract.deployed();
  
    console.log(`Contract "${contractName}" deployed to: ${contract.address}`);
    // on testnet there will be the same address
    // BUT!!! on real blockchain deploy will occur on different addresses
    // thus these contracts will be separate, even if they are similar

    return contract;
}