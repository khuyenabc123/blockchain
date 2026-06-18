# Open first terminal
cd blockchain

# Clear old build caches and compile fresh artifacts
npx hardhat clean
npx hardhat compile

npx hardhar node
npx hardhat run scripts/deploy.ts --network localhost
