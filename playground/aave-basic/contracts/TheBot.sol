//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "./IERC20.sol";
import "./IWETHGateway.sol";
import "hardhat/console.sol";

contract TheBot {
    address arbiter;
    address depositor;
    address beneficiary;
    uint initialDeposit;
    IWETHGateway gateway = IWETHGateway(0xDcD33426BA191383f1c9B431A342498fdac73488);
    IERC20 aWETH = IERC20(0x030bA81f1c18d280636F32af80b9AAd02Cf0854e);

    constructor(address _arbiter, address _beneficiary) payable {
        arbiter = _arbiter;
        beneficiary = _beneficiary;
        depositor = msg.sender;
        initialDeposit = msg.value;

		console.log(initialDeposit);
        gateway.depositETH{value: address(this).balance}(address(this), 0);
    }

    receive() external payable {}

    function approve() external {
        require(msg.sender == arbiter);

        uint balance = aWETH.balanceOf(address(this));
		console.log(balance);
        aWETH.approve(address(gateway), balance);

        gateway.withdrawETH(balance, address(this));
        payable(beneficiary).transfer(initialDeposit);

        selfdestruct(payable(depositor));
    }
}
