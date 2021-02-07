// pragma solidity ^0.7.5;
pragma solidity >=0.6.0 <0.8.0;

interface ILiquidityValueCalculator {
    function computeLiquidityShareValue(uint liquidity, address tokenA, address tokenB) external returns (uint tokenAAmount, uint tokenBAmount);
}
