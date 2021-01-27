const { expect } = require("chai");

describe("Liquidator", function() {
  it("Should update counter once updateCounter is triggered", async function() {
    const Liquidator = await ethers.getContractFactory("Liquidator");
    const liquidator = await Liquidator.deploy();
    
    await liquidator.deployed();
    expect(await liquidator.getCounter()).to.equal(1);

    await liquidator.updateCounter();
    const counterValue  = await liquidator.getCounter();
    console.log(counterValue.toString());
    expect(await liquidator.getCounter()).to.equal(2);
  });
});
