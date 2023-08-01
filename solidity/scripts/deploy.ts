import { ethers, network } from "hardhat";

async function main() {
  if (!process.env.FORWARDER_PRIVATE_KEY) {
    throw new Error("FORWARDER_PRIVATE_KEY env var is not defined");
  }
  const [account] = await ethers.getSigners();

  console.log(`Using ${account.address} for deployment`);
  const collectible = await ethers.deployContract("Collectible", [
    account.address,
  ]);

  await collectible.waitForDeployment();

  console.log(`Collectible deployed to ${await collectible.getAddress()} `);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
