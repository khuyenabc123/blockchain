import { ethers } from "ethers";

async function main() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  const attackerPrivateKey =
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
  const attackerWallet = new ethers.Wallet(attackerPrivateKey, provider);

  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

  console.log(`Attacker Address: ${attackerWallet.address}`);
  console.log("Sending explicit transaction to trigger onlyOwner reversion...");

  const minimalAbi = [
    "function mintCertificate(address student, string memory ipfsHash) public returns (uint256)",
  ];

  const contract = new ethers.Contract(
    contractAddress,
    minimalAbi,
    attackerWallet,
  );

  const tx = await contract.mintCertificate(
    attackerWallet.address,
    "ipfs://test-metadata-cid-hash-string",
  );

  await tx.wait();
}

main().catch((error) => {
  if (error.message && error.message.includes("execution reverted")) {
    console.log("EVM Reversion Catch: Ownable: caller is not the owner");
  } else if (error.reason) {
    console.log(`EVM Reversion Catch: ${error.reason}`);
  } else {
    console.log(error.message || error);
  }

  console.log("========================================================\n");
  process.exitCode = 1;
});
