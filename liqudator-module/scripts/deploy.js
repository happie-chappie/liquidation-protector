const hre = require("hardhat");

async function main() {
  const Liquidator = await hre.ethers.getContractFactory("Liquidator");
  const liquidator = await Liquidator.deploy();

  await liquidator.deployed();

  console.log("Liquidator deployed to:", liquidator.address);
}

// Previous deployment addresses
// 0x14E86E8CA1b7fDE4b0Da67704a28DE18DF7298bC
// 0x5B32C2a2013e94a07929C083854E70eaCC13BFAe

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
