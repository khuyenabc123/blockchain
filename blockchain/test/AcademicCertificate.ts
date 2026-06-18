import { expect } from "chai";
import { ethers } from "hardhat";

describe("AcademicCertificate Security Validations", function () {
  it("Should prevent duplicate minting of the same certificate hash", async function () {
    const [owner, student1, student2] = await ethers.getSigners();

    const AcademicCertificate = await ethers.getContractFactory(
      "AcademicCertificate",
    );
    const contract = await AcademicCertificate.deploy();
    await contract.waitForDeployment();

    const duplicateFileHash =
      "0x7465737466696c65686173683030303030303030303030303030303030303032";
    const mockIpfsMetadataUri =
      "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";

    console.log(`[STAGE 1] Minting initial valid certificate to Ledger...`);
    console.log(` -> Target Student: ${student1.address}`);
    console.log(` -> Payload Hash:   ${duplicateFileHash}`);

    const tx1 = await contract
      .connect(owner)
      .mintCertificate(
        student1.address,
        "STU001",
        "Nguyen Van A",
        "Bachelor of Science",
        "Computer Science",
        mockIpfsMetadataUri,
        duplicateFileHash,
      );
    await tx1.wait();
    console.log(
      "Result: Transaction Successful. State committed to EVM ledger.",
    );

    console.log(
      "\n[STAGE 2] Submitting unauthorized duplicate payload block...",
    );
    console.log(
      ` -> Target Student: ${student2.address} (Malicious or duplicate entry)`,
    );
    console.log(` -> Collision Hash: ${duplicateFileHash}`);

    await expect(
      contract
        .connect(owner)
        .mintCertificate(
          student2.address,
          "STU002",
          "Tran Thi B",
          "Bachelor of Science",
          "Computer Science",
          mockIpfsMetadataUri,
          duplicateFileHash,
        ),
    ).to.be.revertedWith("A certificate with this file hash already exists");

    console.log(
      "Result: Transaction Rejected dynamically by State Validation Guard.",
    );
  });
});
