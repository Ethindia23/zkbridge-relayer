import { ethers, WebSocketProvider } from "ethers";
import abi from "./abi.json";

// FILL IT UP
const txHash = "0xc14f9fa32c8f9b1cdd909d53f713e982f84c06377ba53feaa0bfb6a528626cd0"; 
const multiChainConfig = {
    11155111: {
        url:"wss://sepolia.infura.io/ws/v3/c80aee92018e439c89d8fc1034798344",
        address: "0x4B37d6f0CeA443639D6c7AAcBb76aE20ad8B7a61",
        name: "Ethereum Sepolia"
    },
    80001: {
        url:"wss://polygon-mumbai.infura.io/ws/v3/c80aee92018e439c89d8fc1034798344",
        address: "0xC6CB0Fd10c17D956d02Df470d2697BCCF1305225",
        name: "Polygon Mumbai"
    }
}
// get transaction parsed events
async function getLogs(txHash: string, chainId: number) {
    const provider = new ethers.WebSocketProvider(multiChainConfig[chainId].url);
    const txReceipt = await provider.getTransactionReceipt(txHash);
    const iFace = new ethers.Interface(abi);
    console.log("txReceipt", txReceipt.logs);
    console.log((txReceipt.logs as any).map((log) => iFace.parseLog(log)))
    const logs = (txReceipt.logs as any).map((log) => iFace.parseLog(log)).filter((log) => log.name === "InitiateDeposit")
    if (logs.length === 0) {
        console.log("No logs found for this transaction");
        return;
    }
    const log = logs[0];
    console.log("Key", log.args[0]);
    console.log("chainid", log.args[2]);

    const receiverProvider = new ethers.WebSocketProvider(multiChainConfig[log.args[2]].url);
    const receiverContract = new ethers.Contract(multiChainConfig[log.args[2]].address, abi, receiverProvider);
    const filter = await receiverContract.filters.SuccessfulDeposit(log.args[0]);
    const receiverLogs = await receiverContract.queryFilter(filter);
    console.log("Receiver logs", receiverLogs);
}
getLogs(txHash, 11155111);

