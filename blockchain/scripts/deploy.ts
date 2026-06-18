import { ethers } from "hardhat";

async function main() {
  console.log("Starting deployment of AcademicCertificate contract...");

  const AcademicCertificate = await ethers.getContractFactory(
    "AcademicCertificate",
  );

  const contract = await AcademicCertificate.deploy();

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log(`\n======================================================`);
  console.log(`AcademicCertificate successfully deployed!`);
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`======================================================\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
