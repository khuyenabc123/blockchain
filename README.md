# 📝 NFT For Academic Certificate Verification Platform

## Tech Stack
| Layer | Technology |
|-------|-----------|
|Frontend | React.js, TypeScript, Ant Design (v5)
|Backend Core | Node.js, Express.js, TypeScript
|Database Ledger | MongoDB via Mongoose ODM
|Decentralized Network Engine | Ethereum/Hardhat Local Node EVM Context
|Distributed File Layer | InterPlanetary File System (IPFS Gateway)
|AI Engine Framework | Groq Cloud SDK (llama-3.3-70b-versatile) / Local Ollama Engine

## Prerequisites
- Node.js >= v18.x
- pnpm/yarn/pnpm
- MongoDB Community Server >= v6.0
- Hardhat Runtime Environment
- MetaMask Browser Extension
- Groq Cloud Account
- SMTP Email Credentials
- IPFS Gateway Node Access

## Start System

### 1. Blockchain start/deploy

open new termnial

```bash
cd blockchain/
npx hardhat node
```

open new termnial

```bash
cd blockchain/
npx hardhat clean
npx hardhat compile
npx hardhat run scripts/deploy.ts --network localhost
```
---> NOTE: copy deploy address from this to put in the .env file of /backend folder


### 2. Backend start

open new termnial

```bash
cd backend/
npm run dev
```


### 3. Frontend start

open new termnial

```bash
cd frontend/
npm run dev
```

- Blockchain: http://localhost:8545
- Frontend: http://localhost:5173
- Backend: http://localhost:5000


### 4. Authorization
| Role | Screens |
|------|---------|
| Administrator | University Admin Console |
| Verifier | Cetificate Search |
| Student | Student Portal |


## Environment Variables

`backend/.env` (see `.env.example`)

```bash
PORT=5000
FE_URL=http://localhost:5173
MONGO_URI=your_mongo_db_uri
CONTRACT_ADDRESS=the_deployed_contract_address_from_blockchain
RPC_URL=http://127.0.0.1:8545
PINATA_JWT=your_pinata_secret_token
PRIVATE_KEY=administrator_wallet_address

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=stmp_setting_emal
EMAIL_PASS=stmp_setting_password

PINATA_URL=https://gateway.pinata.cloud/ipfs
GROQ_API_KEY=your_groq_api_key

```


`frontend/.env` (see `.env.example`)

```bash
VITE_BACKEND_URL=http://localhost:5000
```


`blockchain/.env` (see `.env.example`)

```bash
PRIVATE_KEY=your_wallet_private_key
```