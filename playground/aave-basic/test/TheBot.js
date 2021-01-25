const { assert } = require("chai");

describe("The Liquidation Protector Bot", function () {
    let theBot;
    let aWETH;
    let depositor;
    let pool;
    let balanceBefore;

    const deposit = ethers.utils.parseEther("2");

    before(async () => {
        const TheBot = await ethers.getContractFactory("TheBot");
        [depositor] = await ethers.provider.listAccounts();
	console.log("====== The Initial depositor balance =====");
	balanceBefore = await ethers.provider.getBalance(depositor);
	console.log(balanceBefore.toString());
        theBot = await TheBot.deploy({ value: deposit });
        await theBot.deployed();
        aWETH = await ethers.getContractAt("IERC20", "0x030bA81f1c18d280636F32af80b9AAd02Cf0854e");
	pool = await ethers.getContractAt("ILendingPool", "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9");
    });

    it("should not have an ether balance", async function () {
        const balance = await ethers.provider.getBalance(theBot.address);
        assert.equal(balance.toString(), "0");
    });

    it("should have aWETH", async function () {
        const balance = await aWETH.balanceOf(theBot.address);
        assert.equal(balance.toString(), deposit.toString());
    });

    describe('after approving', () => {
        before(async () => {
            const depositorSigner = await ethers.provider.getSigner(depositor);
            const thousandDays = 1000 * 24 * 60 * 60;
            await hre.network.provider.request({
                method: "evm_increaseTime",
                params: [thousandDays]
            });
            await theBot.connect(depositorSigner).approve();
	});

        it('should payback the depositor, and it should be above the initial balance', async () => {
            const balanceAfter = await ethers.provider.getBalance(depositor);
	    console.log("====== The Final depositor balance =====");
	    console.log(balanceAfter.toString());
	    assert.isAbove(balanceAfter, balanceBefore, 'balanceAfter is strictly greater than balanceBefore');
	    // const diff = balanceAfter.sub(balanceBefore);
	    // assert.equal(diff.toString(), deposit.toString());
        });

    });
    /*
    describe('after approving', () => {
        let balanceBefore;
        before(async () => {
            balanceBefore = await ethers.provider.getBalance(beneficiary);
            arbiterBalanceBefore = await ethers.provider.getBalance(arbiter);
	    console.log("===== aave pool =======");
	    // working with the aave pool interface and fetching the data
	    // user account data
	    let foo = await pool.getUserAccountData(theBot.address);
	    let reservesList = await pool.getReservesList();
	    let addressesProvider = await pool.getAddressesProvider();
	    // console.log(reservesList);
	    console.log(addressesProvider);
	    // console.log(foo);
	    // console.log(foo.totalCollateralETH.toString());
	    // console.log(foo.ltv.toString());
	    // console.log(" Balance Before ");
	    // console.log(balanceBefore.toString());
	    // console.log(arbiterBalanceBefore.toString());
            const thousandDays = 1000 * 24 * 60 * 60;
            await hre.network.provider.request({
                method: "evm_increaseTime",
                params: [thousandDays]
            });
            const arbiterSigner = await ethers.provider.getSigner(arbiter);
            await theBot.connect(arbiterSigner).approve();
        });

        it('should provide the principal to the beneficiary', async () => {
            const balanceAfter = await ethers.provider.getBalance(beneficiary);
	    // console.log(" Balance After ");
	    // console.log(balanceAfter.toString());
            const diff = balanceAfter.sub(balanceBefore);
            assert.equal(diff.toString(), deposit.toString());
        });
    });
    */
});

