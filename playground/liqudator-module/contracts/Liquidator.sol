//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "hardhat/console.sol";


contract Liquidator {
  uint counter = 1;

  /*
  constructor(string memory _greeting) {
    console.log("Deploying a Greeter with greeting:", _greeting);
    greeting = _greeting;
  }
  */

  function getCounter() public view returns (uint) {
    return counter;
  }

  function updateCounter() public {
    counter = counter + 1;
  }
}
