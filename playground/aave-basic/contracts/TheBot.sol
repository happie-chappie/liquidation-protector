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
        gateway.depositETH{value: address(this).balance}(address(this), 0);
    }

    receive() external payable {}

    function approve() external {
		// only the escrow account can execute the approve
        // require(msg.sender == this.address);

        uint balance = aWETH.balanceOf(address(this));
		// console.log(balance);
        aWETH.approve(address(gateway), balance);

        gateway.withdrawETH(balance, address(this));
        // payable(depositor).transfer(initialDeposit);

        selfdestruct(payable(depositor));
    }
}
