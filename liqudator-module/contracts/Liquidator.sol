//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

contract Liquidator {
  uint counter = 1;

  function getCounter() public view returns (uint) {
    return counter;
  }

  function updateCounter() public {
    counter = counter + 1;
  }
}
