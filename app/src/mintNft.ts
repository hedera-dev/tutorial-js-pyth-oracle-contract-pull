import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hederaTestnet } from "viem/chains";
import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";
import { getContract } from "viem";

export const abi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_pyth",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_hbarUsdPriceId",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getHbarUsdPriceId",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPyth",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "mint",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "updateAndMint",
    "inputs": [
      {
        "name": "pythPriceUpdate",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "error",
    "name": "InsufficientFee",
    "inputs": []
  }
] as const;

async function run() {
  const account = privateKeyToAccount(process.env["PK"] as any);

  const publicClient = createPublicClient({
    chain: hederaTestnet,
    transport: http("http://localhost:7546/api"),
  })

  const balance = await publicClient.getBalance({address: account.address}) / BigInt(10**18);
  console.log(`Account balance: ${balance} HBAR`);

  const client = createWalletClient({
    account,
    chain: hederaTestnet,
    transport: http("http://localhost:7546/api"),
  });

  const contract = getContract({
    address: process.env["DEPLOYMENT_ADDRESS"] as any,
    abi: abi,
    client,
  });

  console.log(`Contract address: ${contract.address}`);
  console.log(`Pyth address: ${await contract.read.getPyth()}`);
  console.log(`HBAR/USD price ID: ${await contract.read.getHbarUsdPriceId()}`);

  const connection = new EvmPriceServiceConnection(
    "https://hermes.pyth.network"
  );

  const priceIds = [process.env["HBAR_USD_ID"] as string];
  const priceFeedUpdateData = (await connection.getPriceFeedsUpdateData(
    priceIds
  ));

  console.log(`Retrieved Pyth price update for ${process.env["HBAR_USD_ID"]}:`);
  console.log(priceFeedUpdateData);

  const hash = await contract.write.updateAndMint(
    [priceFeedUpdateData as any],
    { value: parseEther("20") }
  );
  console.log("Transaction hash:");
  console.log(hash);
}

run();
