//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "./IERC20.sol";
import "./IWETHGateway.sol";
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

    IWETHGateway gateway = IWETHGateway(0xDcD33426BA191383f1c9B431A342498fdac73488);
    IERC20 aWETH = IERC20(0x030bA81f1c18d280636F32af80b9AAd02Cf0854e);

    constructor() payable {
        depositor = msg.sender;
        initialDeposit = msg.value;

		// console.log(initialDeposit);
		// initally we assume that the depositor has deposited ETH and borrowed ETH
		// depositting in the aave with the escrow contract all the eth
		console.log("===== checking=======");
		console.log(address(this).balance);
        gateway.depositETH{value: address(this).balance}(address(depositor), 0);
        // gateway.depositETH{value: address(this).balance}(address(this), 0);
    }

    receive() external payable {}

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
