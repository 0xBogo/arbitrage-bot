import Web3 from "web3";
import uniswap from "../contracts/uniswap.json";
import erc20ABI from "../contracts/erc-20.abi.json";
import abiDecoder from 'abi-decoder';

const web3 = new Web3("wss://eth-goerli.g.alchemy.com/v2/Pb1bcfBkLXMRUZqgsbNORkYNJ5v4YnV8");

const ETH_AMOUNT = "0.2";
const WETH = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";

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

export const detectSwap = async (tx) => {
    if (tx?.to == uniswap.address) {
        let input = tx.input;
        try {
            input = abiDecoder.decodeMethod(input);
            if (input?.name == "swapETHForExactTokens") {
                console.log(input);
                return input;
            }
            return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    }
    return null;
}

export const buyTokens = async (tx, nonce, token, privateKey, publicKey) => {
    const gasPrice = tx.gasPrice;
    const newGasPrice = Math.floor(parseInt(gasPrice) + parseInt(1));
    const newGasPriceHex = '0x' + newGasPrice.toString(16);
    const gasLimit = Math.floor(tx.gas * 1.2);
    const gasLimitHex = '0x' + gasLimit.toString(16);
    const ethAmount = ETH_AMOUNT * 1e18;
    const ethAmountHex = '0x' + ethAmount.toString(16);
    const path = [WETH, token];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
    const deadlineHex = "0x" + deadline.toString(16);
    const contract = await getUniswapContract();
    const buyTx = contract.methods.swapExactETHForTokens(0, path, publicKey, deadlineHex);
    const createTx = await web3.eth.accounts.signTransaction(
        {
            nonce: nonce,
            from: publicKey,
            to: uniswap.address,
            value: ethAmountHex,
            gasPrice: newGasPriceHex,
            gasLimit: gasLimitHex,
            data: buyTx.encodeABI()
        },
        privateKey
    );
    const createReceipt = await web3.eth.sendSignedTransaction(createTx.rawTransaction);
}

export const sellTokens = async (tx, nonce, token, tokenAmount, privateKey, publicKey) => {
    const gasPrice = tx.gasPrice;
    const newGasPrice = Math.floor(parseInt(gasPrice) - parseInt(1));
    const newGasPriceHex = '0x' + newGasPrice.toString(16);
    const gasLimit = Math.floor(tx.gas * 1.2);
    const gasLimitHex = '0x' + gasLimit.toString(16);
    const tokenAmountHex = '0x' + tokenAmount.toString(16);
    const path = [token, WETH];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
    const deadlineHex = "0x" + deadline.toString(16);
    const contract = await getUniswapContract();
    const buyTx = contract.methods.swapExactTokensForETH(tokenAmountHex, 0, path, publicKey, deadlineHex);
    const createTx = await web3.eth.accounts.signTransaction(
        {
            nonce: nonce,
            from: publicKey,
            to: uniswap.address,
            gasPrice: newGasPriceHex,
            gasLimit: gasLimitHex,
            data: buyTx.encodeABI()
        },
        privateKey
    );
    const createReceipt = await web3.eth.sendSignedTransaction(createTx.rawTransaction);
}