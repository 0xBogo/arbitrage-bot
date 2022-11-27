import Web3 from "web3";
import uniswap from "../contracts/uniswap.json";
import erc20ABI from "../contracts/erc-20.abi.json";

const web3 = new Web3("https://rpc.ankr.com/eth_goerli");

export const getUniswapContract = async () => {
    const _contract = await _getContract(uniswap.address, uniswap.abi);
    return _contract;
}

export const getERC20Contract = async (address) => {
    const _contract = await _getContract(address, erc20ABI);
    return _contract;
}

const _getContract = async (address, abi) => {
    const _contract = await new web3.eth.Contract(abi, address);
    return _contract;
}

export const sendContractMethod = async (txData, key) => {
    const createTransaction = await web3.eth.accounts.signTransaction(txData, key);
    const createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
    console.log(`Tx successful with hash: ${createReceipt.transactionHash}`);
    return createReceipt.transactionHash;
}