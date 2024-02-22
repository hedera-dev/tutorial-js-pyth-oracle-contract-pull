# Pyth Demo on Hedera - Mint a 1$ NFT

This demo is a simple example of how to use Pyth prices in Hedera and is based on the
[tutorial](https://docs.pyth.network/price-feeds/create-your-first-pyth-app/evm) here. Follow the instructions in the
tutorial to build and deploy and use this demo.

This demo is similar to the contract written in the tutorial. The only difference is that it uses a different math to
calculate the price of 1$ in HBAR because In the Hedera EVM layer, the native token has only 8 decimal places, while in
Ethereum it has 18 decimal places. This means that the smallest unit of HBAR (1 wei in Hedera EVM) is 0.00000001 HBAR,
while the smallest unit of ETH is 0.000000000000000001 ETH. You can see the change in the code in the
[MyFirstPythContract.sol](./contracts/src/MyFirstPythContract.sol).
