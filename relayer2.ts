const ethers = require("ethers");
const ABI = require("./abi.json");

async function getTransfer(){
    const usdcAddress = "0x5cA453996722BAdc7Ac130314d0c97eF7e90588d"; ///USDC Contract
    const provider = new ethers.providers.WebSocketProvider(
        `wss://eth-sepolia.g.alchemy.com/v2/a-Fh3t-RUkQ9QbOnq1Y-j24IMO55bbFq`
    );
    const contract = new ethers.Contract(usdcAddress, ABI, provider);
    console.log("Adding event listener for Deposit", contract);
    contract.on("Deposit", (root, hashPairings, pairDirection) => {
        console.log("Deposit event fired")
        console.log(root, hashPairings, pairDirection);
    })
}
getTransfer()