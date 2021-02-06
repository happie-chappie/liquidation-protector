const fs = require('fs');
const { assert } = require("chai");

const getAbi = require('./getAbi');
const aTokenAbi = getAbi.getATokenAbi();
// console.log(aTokenAbi);

// const TokenAbi = fs.readFileSync("./aTokenAbi.json");

describe("The Liquidation Protector Bot", function () {
  let theBot;
  let aWETH;
  let depositor;
  let pool;
  let balanceBefore;
  let aTokenContract;

  const deposit = ethers.utils.parseEther("2");

  // sample address on mainnet with tons of ERC 20 tokens
  const billionaireAddress = "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503";
  let depositorAddr = "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503";

  before(async () => {
    // const TheBot = await ethers.getContractFactory("TheBot");
    [depositor] = await ethers.provider.listAccounts();

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [depositorAddr]
    })

    console.log("====== The Initial depositor balance =====");
    balanceBefore = await ethers.provider.getBalance(depositor);
    console.log(balanceBefore.toString());

    const depositorSignerTwo = await ethers.provider.getSigner(depositor);

    aWETH = await ethers.getContractAt("IERC20", "0x030bA81f1c18d280636F32af80b9AAd02Cf0854e");
    aTokenContract = await ethers.getContractAt(aTokenAbi, "0x030bA81f1c18d280636F32af80b9AAd02Cf0854e");
    pool = await ethers.getContractAt("ILendingPool", "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9");

    // console.log(depositorSignerTwo);
    // depositing dai in theBot
    dai = await ethers.getContractAt(
      "IERC20", "0x6b175474e89094c44da98b954eedeac495271d0f", depositorSignerTwo);
    const escrowAddress = ethers.utils.getContractAddress({
      from: depositorAddr,
      nonce: (await ethers.provider.getTransactionCount(depositorAddr)) + 1,
    });
    await dai.approve(escrowAddress, deposit);
    const TheBot = await ethers.getContractFactory("TheBot", depositorSignerTwo);
    theBot = await TheBot.deploy(deposit);
    await theBot.deployed();
    console.log("====== dai balance ======");
    const daiBalance = await dai.balanceOf(theBot.address);
    console.log(daiBalance.toString());
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

  it("Testing making a transaction", async () => {
    theBot.makeTransaction();
  });

  /*
  it("Testing flash loan workflow", async () => {
    await theBot.flashLoanPlay();
  });
  */

  /*
    it('Should fetch all the aTokens', async () => {
      const aTokens = await theBot.getAllTokens();
      console.log(aTokens);
    });
    */

  /*
    describe('DAI is deposited, Escrow account should be able to ', () => {
	before(async () => {
	*/
  describe('user permiting another account to use their funds', () => {
    before(async () => {
      // fetch the depositor
      const depositorSigner = await ethers.provider.getSigner(depositor);
      // time travelling
      const thousandDays = 1000 * 24 * 60 * 60;
      await hre.network.provider.request({
	method: "evm_increaseTime",
	params: [thousandDays]
      });
      // checking the depositor aWETH balance
      const aWETHBalance = await aWETH.balanceOf(depositor);

      const chainId = 1
      const owner = depositor;
      const spender = theBot.address
      // const value = ethers.constants.MaxUint256  // Amount the spender is permitted
      const value = 100
      const nonce = 4 // The next valid nonce, use `_nonces()`
      const deadline = 1791193162

      // depositor signing message to give the escorow permissions to use aWETH
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

      const signedMessage = await depositorSigner.signMessage(JSON.stringify({data: permitParams}));
      // const signedMessage = await depositorSigner.signMessage({data: permitParams});
      const latestNonce = await depositorSigner.getTransactionCount();
      console.log("=========== testing the permit ==========");
      console.log(signedMessage);
      console.log(latestNonce);
      console.log(ethers.utils.splitSignature(signedMessage));
      const { v, r, s } = ethers.utils.splitSignature(signedMessage);
      const prefix = "\x19Ethereum Signed Message:\n32";
      const prefixedHash = ethers.utils.keccak256(owner, spender, 10, 21200, 1);
      // console.log(ecrecover(prefixedHash, v, r, s));
      //console.log(v);
      // console.log(r);
      // console.log(s);

      // await aTokenContract.connect(depositorSigner).permit(owner, spender, value, deadline, v, r, s);
    })
    it('escrow contract should be able to use the funds', async () => {
      console.log("====== Testing the permit workflow =====");
    });


  })
  /*

  describe('after approving', () => {
    before(async () => {
      // fetch the depositor
      const depositorSigner = await ethers.provider.getSigner(depositor);
      // time travelling
      const thousandDays = 1000 * 24 * 60 * 60;
      await hre.network.provider.request({
	method: "evm_increaseTime",
	params: [thousandDays]
      });
      // checking the depositor aWETH balance
      const aWETHBalance = await aWETH.balanceOf(depositor);

      console.log("=== analyzing the signer ===");
      console.log(depositor);
      console.log(theBot.address);
      // console.log(depositorSigner);

      console.log(" the aweth balance of depositor is ");
      console.log(aWETHBalance.toString());

      // depositor approving the escorow to use aWETH
      await aWETH.connect(depositorSigner).approve(theBot.address, aWETHBalance);
      // calling the approve functionality of the contract
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

