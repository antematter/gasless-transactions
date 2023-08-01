import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Collectible } from "../typechain-types";
import { Signer } from "ethers";

describe("Collectible", function () {
  let contract: Collectible;
  let accounts: Signer[];
  let forwarder: Signer;
  this.beforeEach(async () => {
    const CollectibleFactory = await ethers.getContractFactory("Collectible");

    accounts = await ethers.getSigners();
    forwarder = accounts[1];

    contract = await CollectibleFactory.deploy(await forwarder.getAddress());
  });

  it("mints NFT", async () => {
    await contract.connect(accounts[0]).mintNFT();
    expect(await contract.connect(accounts[0]).balanceOf(accounts[0])).to.equal(
      1
    );
  });

  it("forwards tx", async () => {
    const tx = await contract.mintNFT.populateTransaction();

    const calldata = tx.data.concat((await accounts[0].getAddress()).slice(2));
    await forwarder.sendTransaction({
      to: await contract.getAddress(),
      data: calldata,
    });
    expect(await contract.connect(accounts[0]).balanceOf(accounts[0])).to.equal(
      1
    );
  });
});
