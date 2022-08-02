import * as dotenv from 'dotenv';
dotenv.config(); // connecting to .env

export const ENV = {
    GOERLI_URL: process.env.GOERLI_URL as string,
    GOERLI_API_KEY: process.env.GOERLI_API_KEY as string,
    PRIVATE_KEY: process.env.PRIVATE_KEY as string,
    BEER_CONTRACT_ADDRESS: process.env.BEER_CONTRACT_ADDRESS as string,
}