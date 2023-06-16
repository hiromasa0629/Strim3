import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Strim", function () {
  async function deployContract() {
    const factory = await ethers.getContractFactory("Strim");
    const contract = await factory.deploy();

    await contract.waitForDeployment();

    const [owner, account1] = await ethers.getSigners();

    return { contract, owner, account1 };
  }

  async function deployContractAndCreateStrim() {
    const { contract, owner, account1 } = await loadFixture(deployContract);

    await contract.connect(owner).createStrim();
    await contract.connect(owner).modifyStrimURI("Helloworld");

    return { contract, owner, account1 };
  }

  describe("createStrim", () => {
    it("should create a strim and modified uri", async () => {
      const { contract, owner } = await loadFixture(
        deployContractAndCreateStrim
      );
      const res = await contract.getAllStream(owner);
      expect(res[0][0]).to.be.equal(1);
      expect(res[0][1]).to.be.equal("Helloworld");
    });

    it("should not allow modifyURI", async () => {
      const { contract, account1 } = await loadFixture(
        deployContractAndCreateStrim
      );
      await expect(contract.connect(account1).modifyStrimURI("Throw")).to.be
        .rejected;
    });
  });

  async function deployContractAndCreateStrimAndClip() {
    const { contract, owner, account1 } = await loadFixture(
      deployContractAndCreateStrim
    );

    await contract.connect(account1).clip(owner, "Sup");

    return { contract, owner, account1 };
  }

  describe("clip", () => {
    it("should clip", async () => {
      const { contract, account1 } = await loadFixture(
        deployContractAndCreateStrimAndClip
      );
      const res = await contract.getAllClip(account1);
      expect(res[0][0]).to.be.equal(2);
      expect(res[0][1]).to.be.equal("Sup");
    });

    it("clip should be under stream", async () => {
      const { contract, account1 } = await loadFixture(
        deployContractAndCreateStrimAndClip
      );
      const res = await contract.getAllClipsUnderStream(1);
      expect(res[0][0]).to.be.equal(2);
      expect(res[0][1]).to.be.equal("Sup");
    });
  });
});
