import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account: ", deployer.address);

  const preDeployBalance = await deployer.getBalance();
  console.log("Pre Deploy Balance: ", preDeployBalance.toString());

  const Item = await ethers.getContractFactory("NFTItem");
  const nftItem = await Item.deploy();
  console.log("Item Address: ", nftItem.address);

  const Market = await ethers.getContractFactory("NFTMarket");
  const nftMarket = await Market.deploy();
  console.log("Market Address: ", nftMarket.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
