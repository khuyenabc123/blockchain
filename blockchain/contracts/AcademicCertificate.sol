// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AcademicCertificate is ERC721, Ownable {
    uint256 private nextTokenId;

    constructor() ERC721("Academic Certificate", "ACERT") {}

    struct Certificate {
        string studentId;
        string studentName;
        string degree;
        string major;
        string ipfsHash;
        uint256 issueDate;
        bool isRevoked;
        uint256 revokedAt;
        string revocationReason;
        string fileHash;
    }

    event CertificateMinted(
        uint256 indexed tokenId,
        address indexed student,
        string studentId,
        string studentName,
        string degree,
        string major,
        string ipfsHash,
        uint256 issueDate,
        string fileHash
    );

    event CertificateRevoked(
        uint256 indexed tokenId,
        string reason,
        uint256 revokedAt
    );

    mapping(uint256 => Certificate) public certificates;
    mapping(string => uint256) public hashToTokenId;

    function mintCertificate(
        address student,
        string memory studentId,
        string memory studentName,
        string memory degree,
        string memory major,
        string memory ipfsHash,
        string memory fileHash
    ) public onlyOwner {
        require(
            hashToTokenId[fileHash] == 0,
            "A certificate with this file hash already exists"
        );

        uint256 tokenId = ++nextTokenId;

        _safeMint(student, tokenId);

        certificates[tokenId] = Certificate(
            studentId,
            studentName,
            degree,
            major,
            ipfsHash,
            block.timestamp,
            false,
            0,
            "",
            fileHash
        );

        hashToTokenId[fileHash] = tokenId;

        emit CertificateMinted(
            tokenId,
            student,
            studentId,
            studentName,
            degree,
            major,
            ipfsHash,
            block.timestamp,
            fileHash
        );
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);

        require(
            from == address(0),
            "AcademicSBT: Transfer restriction enforced - Credentials are non-transferable"
        );
    }

    function approve(address, uint256) public pure override {
        revert("Soulbound: No approvals allowed");
    }

    function setApprovalForAll(address, bool) public pure override {
        revert("Soulbound: No approvals allowed");
    }

    function getCertificateByHash(
        string memory fileHash
    )
        public
        view
        returns (
            uint256 tokenId,
            string memory studentId,
            string memory studentName,
            string memory degree,
            string memory major,
            string memory ipfsHash,
            uint256 issueDate,
            bool isRevoked,
            uint256 revokedAt,
            string memory revocationReason
        )
    {
        uint256 id = hashToTokenId[fileHash];
        require(id > 0, "No certificate matches this file hash");

        Certificate memory cert = certificates[id];
        return (
            id,
            cert.studentId,
            cert.studentName,
            cert.degree,
            cert.major,
            cert.ipfsHash,
            cert.issueDate,
            cert.isRevoked,
            cert.revokedAt,
            cert.revocationReason
        );
    }

    modifier requireMinted(uint256 tokenId) {
        require(
            tokenId > 0 && tokenId <= nextTokenId,
            "Certificate does not exist"
        );
        _;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override requireMinted(tokenId) returns (string memory) {
        return
            string(abi.encodePacked("ipfs://", certificates[tokenId].ipfsHash));
    }

    function getCertificate(
        uint256 tokenId
    )
        public
        view
        returns (
            string memory studentId,
            string memory studentName,
            string memory degree,
            string memory major,
            string memory ipfsHash,
            uint256 issueDate,
            bool isRevoked,
            uint256 revokedAt,
            string memory revocationReason
        )
    {
        Certificate memory cert = certificates[tokenId];
        return (
            cert.studentId,
            cert.studentName,
            cert.degree,
            cert.major,
            cert.ipfsHash,
            cert.issueDate,
            cert.isRevoked,
            cert.revokedAt,
            cert.revocationReason
        );
    }

    function revokeCertificate(
        uint256 tokenId,
        string memory reason
    ) public onlyOwner {
        require(
            tokenId > 0 && tokenId <= nextTokenId,
            "Certificate does not exist"
        );
        Certificate storage cert = certificates[tokenId];
        require(!cert.isRevoked, "Certificate already revoked");

        cert.isRevoked = true;
        cert.revokedAt = block.timestamp;
        cert.revocationReason = reason;

        emit CertificateRevoked(tokenId, reason, block.timestamp);
    }
}
