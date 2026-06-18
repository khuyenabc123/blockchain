import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  const network = await provider.getNetwork();

  console.log("Chain Name:", network.name);
  console.log("Chain ID:", network.chainId.toString());
}

main();