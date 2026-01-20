const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWei = (n) => ethers.utils.parseEther(n.toString());

describe("Marketplace — Auction / Bidding", function () {
  let nft, marketplace;
  let deployer, seller, bidder1, bidder2;
  let feePercent = 1;
  let URI = "ipfs://sample";

  beforeEach(async () => {
    [deployer, seller, bidder1, bidder2] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy();

    const Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy(deployer.address, feePercent);
  });

  describe("Finalize Auction", () => {

    it("transfers NFT and ETH correctly", async () => {
      // mint fresh NFT
      await nft.connect(seller).mint(URI);
      await nft.connect(seller).setApprovalForAll(marketplace.address, true);

      await marketplace
        .connect(seller)
        .makeAuctionItem(nft.address, 1, toWei(1), 60);

      await marketplace
        .connect(bidder1)
        .placeBid(1, { value: toWei(2) });

      // move time AFTER endTime
      await ethers.provider.send("evm_increaseTime", [70]);
      await ethers.provider.send("evm_mine");

      const sellerBalanceBefore = await seller.getBalance();
      const feeBalanceBefore = await deployer.getBalance();

      await marketplace.finalizeAuction(1);

      expect(await nft.ownerOf(1)).to.equal(bidder1.address);

      const sellerBalanceAfter = await seller.getBalance();
      const feeBalanceAfter = await deployer.getBalance();

      expect(sellerBalanceAfter).to.be.gt(sellerBalanceBefore);
      expect(feeBalanceAfter).to.be.gt(feeBalanceBefore);
    });

    it("returns NFT to seller if no bids", async () => {
      // mint NEW NFT (important)
      await nft.connect(seller).mint(URI);
      await nft.connect(seller).setApprovalForAll(marketplace.address, true);

      await marketplace
        .connect(seller)
        .makeAuctionItem(nft.address, 1, toWei(1), 60);

      await ethers.provider.send("evm_increaseTime", [70]);
      await ethers.provider.send("evm_mine");

      await marketplace.finalizeAuction(1);

      expect(await nft.ownerOf(1)).to.equal(seller.address);
    });
  });
});
