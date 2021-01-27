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

    it("depositor should have aWETH", async function () {
        const balance = await aWETH.balanceOf(depositor);
	// console.log(balance);
      // assert.equal(balance.toString(), deposit.toString());
    });

    /*
    describe('DAI is deposited, Escrow account should be able to ', () => {
        before(async () => {
    */

    describe('after approving', () => {
        before(async () => {
            const depositorSigner = await ethers.provider.getSigner(depositor);
            const thousandDays = 1000 * 24 * 60 * 60;
            await hre.network.provider.request({
                method: "evm_increaseTime",
                params: [thousandDays]
            });
	    const aWETHBalance = await aWETH.balanceOf(depositor);

	    console.log("=== analyzing the signer ===");
	    console.log(depositor);
	    console.log(theBot.address);
	    // console.log(depositorSigner);
	  
	    console.log(" the aweth balance of depositor is ");
	    console.log(aWETHBalance.toString());

	    const chainId = 1
	    const owner = depositor;
	    const spender = theBot.address
	    const value = ethers.constants.MaxUint256  // Amount the spender is permitted
	    const nonce = 1 // The next valid nonce, use `_nonces()`
	    const deadline = 1800093162

	    const permitParams = {
	      types: {
		EIP712Domain: [
		  { name: "name", type: "string" },
		  { name: "version", type: "string" },
		  { name: "chainId", type: "uint256" },
		  { name: "verifyingContract", type: "address" },
		],
		Permit: [
		  { name: "owner", type: "address" },
		  { name: "spender", type: "address" },
		  { name: "value", type: "uint256" },
		  { name: "nonce", type: "uint256" },
		  { name: "deadline", type: "uint256" },
		],
	      },
	      primaryType: "Permit",
	      domain: {
		name: "aWETH",
		version: "1",
		chainId: chainId,
		verifyingContract: "0x030bA81f1c18d280636F32af80b9AAd02Cf0854e",
	      },
	      message: {
		owner,
		spender,
		value,
		nonce,
		deadline,
	      },
	    }

	    const signedMessage = await depositorSigner.signMessage(JSON.stringify(permitParams));
	    console.log(signedMessage);
	    // console.ethers.utils.splitSignature(signedMessage));
	    const { v, r, s } = ethers.utils.splitSignature(signedMessage);
	  // console.log(aWETH);
	  // await theBot.connect(depositorSigner).permitHelper(owner, spender, value, deadline, v, r, s);
	    await aWETH.connect(depositorSigner).permit(owner, spender, value, deadline, v, r, s);


	    await aWETH.connect(depositorSigner).approve(theBot.address, aWETHBalance);
            await theBot.connect(depositorSigner).approve();
	});

        it('should payback the depositor, and it should be above the initial balance', async () => {
            const balanceAfter = await ethers.provider.getBalance(depositor);
	    console.log("====== The Final depositor balance =====");
	    console.log(balanceAfter.toString());
	  // assert.isAbove(balanceAfter, balanceBefore, 'balanceAfter is strictly greater than balanceBefore');
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

