import { ethers, WebSocketProvider } from "ethers";
import abi from "./abi.json";

const PRIVATE_KEY = "<env>";

const multiChainConfig = {
    11155111: {
        url:"wss://sepolia.infura.io/ws/v3/c80aee92018e439c89d8fc1034798344",
        address: "0x0Ab1BF1702E711f152Fc6C49C8873Bff7da4810F",
        name: "Ethereum Sepolia"
    },
    80001: {
        url:"wss://polygon-mumbai.infura.io/ws/v3/c80aee92018e439c89d8fc1034798344",
        address: "0x59C444D372CcD30dB429D6AE01959B0878b5CC91",
        name: "Polygon Mumbai"
    }
}

const providers: {[key: number]: WebSocketProvider} = {}
const contracts: {[key: number]: ethers.Contract} = {}
const walletSigners: {[key: number]: ethers.Wallet} = {}
const writeContracts: {[key: number]: ethers.Contract} = {}


const handleDeposit = (chain: number) => {
    return async (uniqueKey: any, dType: any, destinationChain: any, commitment: any) => {
        try {
            console.log("Deposit event fired in :", chain)
            console.log("Destination Chain: ", destinationChain)
            console.log("Commitment: ", commitment)
            console.log(uniqueKey, dType, destinationChain, commitment);
            await writeContracts[destinationChain]._selfDeposit(uniqueKey, commitment);
            console.log("Deposit successful")
        } catch (error) {
            console.log("Error in deposit event handler", error)
        }
    }
}


for (const chain in multiChainConfig) {
    console.log("connecting to url ", multiChainConfig[chain].url)
    providers[chain] = new ethers.WebSocketProvider(multiChainConfig[chain].url);
    console.log(`Connected to ${chain}, ${multiChainConfig[chain].name} chain`);
    contracts[chain] = new ethers.Contract(multiChainConfig[chain].address, abi, providers[chain]);
    contracts[chain].on("InitiateDeposit", handleDeposit(Number(chain)));

    walletSigners[chain] = new ethers.Wallet(PRIVATE_KEY, providers[chain]);
    // console.log(new ethers.Wallet(PRIVATE_KEY, providers[chain]).address);
    writeContracts[chain] = contracts[chain].connect(walletSigners[chain]);
}

