const { assert } = require("chai");

describe("The Liquidation Protector Bot", function () {
  let theBot;

  const deposit = ethers.utils.parseEther("2");

  before(async () => {
    [depositor] = await ethers.provider.listAccounts();

    const TheBot = await ethers.getContractFactory("TheBot", depositorSignerTwo);
    theBot = await TheBot.deploy({value: deposit});
    await theBot.deployed();
  });

  it("should not have an ether balance", async function () {
    const balance = await ethers.provider.getBalance(theBot.address);
    assert.equal(balance.toString(), "0");
  });
});
