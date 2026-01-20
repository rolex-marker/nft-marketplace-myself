const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TokenModule = buildModule("TokenModule", (m) => {
  const marketplacek = m.contract("Marketplace");
  const nft = m.contract("NFT");

  return { marketplacek, nft };
});

module.exports = TokenModule;