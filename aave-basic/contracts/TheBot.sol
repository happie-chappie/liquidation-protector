//SPDX-License-Identifier: Unlicense
// pragma solidity ^0.7.0;
pragma solidity ^0.6.6;
pragma experimental ABIEncoderV2;

import "./IERC20.sol";
import "./IWETHGateway.sol";
import "./IProtocolDataProvider.sol";
import "./ILendingPool.sol";
import "hardhat/console.sol";

/*
This is the Liquidation Protection Bot, features of this bot are
	- This is an escrow account

There is the depositor - who wants liquidity to be protected
Core Wrapper is for 
1 depositor
Deposited 2 ETH
Borrowed 1 ETH
ETH => USDT
Instant Liquidation
*/
contract TheBot {
    address depositor;
    uint initialDeposit;

	struct TokenData {
		string symbol;
		address tokenAddress;
	  }

	TokenData[] aTokens;


    IWETHGateway gateway = IWETHGateway(0xDcD33426BA191383f1c9B431A342498fdac73488);
    IERC20 aWETH = IERC20(0x030bA81f1c18d280636F32af80b9AAd02Cf0854e);
	// aave interest bearing DAI
    IERC20 aDai = IERC20(0x028171bCA77440897B824Ca71D1c56caC55b68A3);
    // the DAI stablecoin 
    IERC20 dai = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
	// aave protocol data provider
	IProtocolDataProvider protocolDataProvider = IProtocolDataProvider(0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d);
	ILendingPool constant pool = ILendingPool(0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9);

    constructor(uint _amount) payable {
        depositor = msg.sender;
        initialDeposit = msg.value;

		// console.log(initialDeposit);
		// initally we assume that the depositor has deposited ETH and borrowed ETH
		// depositting in the aave with the escrow contract all the eth
		console.log("===== checking=======");
		console.log(address(this).balance);
		// dai.transferFrom(depositor, address(this),  _amount);
		// console.log(dai.balanceOf(address(this)));
		// we deposit ETH into depositor account
        // gateway.depositETH{value: address(this).balance}(address(depositor), 0);
        // gateway.depositETH{value: address(this).balance}(address(this), 0);
    }

    receive() external payable {}


	function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address,
        bytes calldata
    )
        external
        // override
        returns (bool)
    {
		console.log("======== in the execution operation =========");
        // for (uint i = 0; i < assets.length; i++) {
		uint amountOwing = amounts[0] + premiums[0];
		console.log("======== in the execution operation =========");
		console.log(amounts[0]);
		console.log(premiums[0]);
		console.log(amountOwing);
		console.log(dai.balanceOf(address(this)));
		dai.approve(address(pool), amountOwing);
		console.log("======== in the execution operation =========");
		// }
        
        return true;
    }

	function makeTransaction() external {
		console.log("==== making transaction =====");
	}

	/*
	function permitHelper(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external {
		// aWETH.permit(owner, spender, value, deadline, v, r, s);
		unint x;
	}
	*/
    function flashLoanPlay() external {
		console.log("======== working with flash loan =========");
		address receiverAddress = address(this);

        address[] memory assets = new address[](1);
        assets[0] = address(dai);

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 10000;

        // 0 = no debt, 1 = stable, 2 = variable
        uint256[] memory modes = new uint256[](1);
        modes[0] = 1;

        address onBehalfOf = address(this);
        bytes memory params = "";
        uint16 referralCode = 0;

		console.log("===== starting the loan =======");

        pool.flashLoan(
            receiverAddress,
            assets,
            amounts,
            modes,
            onBehalfOf,
            "",
            0
        );
		
	}

    function approve() external {
		// only the escrow account can execute the approve
        // require(msg.sender == this.address);

        // uint balance = aWETH.balanceOf(address(msg.sender));
        // uint balance = aWETH.balanceOf(address(this));
		// console.log("===== checking=======");
		// console.log(balance);
        // aWETH.allowance(address(this), address(depositor));
        // aWETH.allowance(address(gateway), address(depositor));
        // aWETH.allowance(address(depositor), address(gateway));
        // aWETH.approve(address(this), balance);
		aWETH.transferFrom(msg.sender, address(this), initialDeposit);
        uint balance = aWETH.balanceOf(address(msg.sender));
        // uint balance = aWETH.balanceOf(address(this));
		console.log("===== checking=======");
		console.log(balance);
        // aWETH.approve(address(this), balance);
        // aWETH.allowance(address(depositor), address(this));
        // aWETH.allowance(address(gateway), address(this));

        // gateway.withdrawETH(0, address(msg.sender));
        // gateway.withdrawETH(uint(-1), address(this));
        // gateway.withdrawETH(uint(-1), address(depositor));
        // gateway.withdrawETH(1, address(depositor));
        // gateway.withdrawETH(1, address(depositor));
        // payable(depositor).transfer(initialDeposit);

        // selfdestruct(payable(depositor));
    }
}
