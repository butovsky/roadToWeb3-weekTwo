import hardhat from 'hardhat';
import { ENV } from '../env.config';
import { BuyMeABeer } from '../typechain-types';

export const getBalance = async (address: string ): Promise<string> => {
    const balanceInWei = await hardhat.waffle.provider.getBalance(address); // from this waffle provider we get the balance of an address (https://getwaffle.io)
    return hardhat.ethers.utils.formatEther(balanceInWei); // this is just `return formatUnits(wei, 18);`, dividing by 18
    // todo: check for other utils: https://docs.ethers.io/v5/api/utils/
  }
  
export const printBalances = async (addresses: string[]): Promise<void> => {
    let i = 0;
    for (const address of addresses) {
        console.log(`Address ${i++}: ${await getBalance(address)}`);
    }
}
  
export const printMemos = async (memos: BuyMeABeer.MemoStructOutput[]): Promise<void> => {
    for (const memo of memos) {
        const { from, timestamp, name, message, beerSize } = memo;

        console.log(`Got a ${beerSize == 0 ? "small" : "large"} beer with a message "${message}" from ${name} (address: ${from}) at ${new Date(Number(timestamp) * 1000).toUTCString()}`)
        // again, timestamp is in seconds here, while we need milliseconds, thus multiplying by 1000.
    }
}

export const getSigner = async () => {
    // connection to AlchemyProvider based on contract address and on API key of the network, on which the contract is deployed
    const provider = new hardhat.ethers.providers.AlchemyProvider("goerli", ENV.GOERLI_API_KEY);

    // private key is of the original creator of the contract, in spite of whoever the owner is now
    return new hardhat.ethers.Wallet(ENV.PRIVATE_KEY, provider);
}