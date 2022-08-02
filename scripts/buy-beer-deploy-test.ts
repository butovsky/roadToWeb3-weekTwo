import hardhat from "hardhat";
import { BuyMeABeer } from "../typechain-types"; // very important and cool for any kinds of interfaces!
import { deploy } from "./deploy";
import { DeployedContracts } from "./types";
import { printBalances, printMemos } from "./utils";

// in this function we also test the contract on initialization
async function main() {
  const [owner, tipper, tipper1] = await hardhat.ethers.getSigners();

  const buyMeABeer = await deploy(DeployedContracts.BUY_ME_A_BEER) as BuyMeABeer;

  console.log(`--------BALANCE CHECK---------`);

  const addresses = [owner.address, tipper.address, buyMeABeer.address];
  await printBalances(addresses);

  const tip1 = { value: hardhat.ethers.utils.parseEther("1")} // we always specify value on transfer this way: { value: ... };
  const tip2 = { value: hardhat.ethers.utils.parseEther("0.002")}

  // todo: investigate typechain-types more! amazing thing for typing contracts etc

  await buyMeABeer.connect(tipper).sendMemo("Oleg", "chuvaki", tip1); // value is the last argument
  await buyMeABeer.connect(tipper1).sendMemo("German", "s g d", tip2);
  console.log(`--------MEMO SENT---------`);

  await printBalances(addresses);
  const memos: BuyMeABeer.MemoStructOutput[] = await buyMeABeer.getMemos();
  await printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
