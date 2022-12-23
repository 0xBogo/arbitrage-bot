import Web3 from "web3";
import uniswap from "../contracts/uniswap.json";
import uniswapFactory from "../contracts/uniswap_factory.json";
import erc20ABI from "../contracts/erc-20.abi.json";
import addresses from "../contracts/address.json";
import abiDecoder from 'abi-decoder';

const { weth } = addresses;

const provider = new Web3.providers.WebsocketProvider("wss://mainnet.infura.io/ws/v3/9aa3d95b3bc440fa88ea12eaa4456161");
// const provider = new Web3.providers.WebsocketProvider("wss://goerli.infura.io/ws/v3/9aa3d95b3bc440fa88ea12eaa4456161");
export const web3 = new Web3(provider);

export const getUniswapContract = async () => {
    const _contract = await _getContract(uniswap.address, uniswap.abi);
    return _contract;
}

export const getUniswapFactoryContract = async () => {
    const _contract = await _getContract(uniswapFactory.address, uniswapFactory.abi);
    return _contract;
}

export const getERC20Contract = async (address) => {
    const _contract = await _getContract(address, erc20ABI);
    return _contract;
}

export const getTokenData = async (address) => {
    const _contract = await getERC20Contract(address);
    const name = await _contract.methods.name().call();
    const symbol = await _contract.methods.symbol().call();
    const decimals = await _contract.methods.decimals().call();
    const totalSupply = await _contract.methods.totalSupply().call();
    return { name: name, symbol: symbol, decimals: decimals, totalSupply: totalSupply };
}

export const getBalance = async (address) => {
    const balance = await web3.eth.getBalance(address);
    return balance;
}

const _getContract = async (address, abi) => {
    const _contract = await new web3.eth.Contract(abi, address);
    return _contract;
}

export const getPairAddress = async (address) => {
    const contract = await getUniswapFactoryContract();
    const pair = await contract.methods.getPair(address, weth).call();
    return pair;
}

export const sendContractMethod = async (txData, key) => {
    const createTransaction = await web3.eth.accounts.signTransaction(txData, key);
    const createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
    console.log(`Tx successful with hash: ${createReceipt.transactionHash}`);
    return createReceipt.transactionHash;
}

export async function detectSwap(tx, account) {
    if (tx?.to === uniswap.address) {
        console.log(tx);
        let input = tx.input;
        try {
            input = abiDecoder.decodeMethod(input);
            if (input?.name === "swapETHForExactTokens" || input?.name === "swapExactETHForTokens") {
                // console.log(input);
                // const path = input?.params?.filter(param => param?.name === "path");
                // console.log(path?.value[path?.value?.length - 1]);
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

export async function buyTokens(tx, nonce, tokenAddress, account, ethAmountHex, tokenAmount) {
    try {
        const gasPrice = tx.gasPrice;
        const newGasPrice = Math.floor(parseInt(gasPrice) * 1.1);
        const newGasPriceHex = '0x' + newGasPrice.toString(16);
        const gasLimit = Math.floor(tx.gas * 1.2);
        const gasLimitHex = '0x' + gasLimit.toString(16);
        const path = [weth, tokenAddress];
        //const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
        //const deadlineHex = "0x" + deadline.toString(16);
        const contract = await getUniswapContract();
        const buyTx = contract.methods.swapExactETHForTokens(0, path, account.publicKey, Date.now() + 1000 * 60);
        console.log(gasLimit, newGasPrice);
        const createTx = await web3.eth.accounts.signTransaction(
            {
                nonce: nonce,
                from: account.publicKey,
                to: uniswap.address,
                value: ethAmountHex,
                gasPrice: newGasPriceHex,
                gas: gasLimitHex,
                data: buyTx.encodeABI()
            },
            account.privateKey
        );
        console.log("BUY: ", createTx.rawTransaction);
        const createReceipt = await web3.eth.sendSignedTransaction(createTx.rawTransaction);
        console.log(createReceipt);
        console.log("SUCCESS");
    } catch (err) {
        console.log("FAILED");
        console.log(err);
    }
}

export async function sellTokens(tx, nonce, tokenAddress, account, tokenAmount) {
    try {
        const gasPrice = tx.gasPrice;
        const newGasPrice = Math.floor(parseInt(gasPrice) * 0.9);
        const newGasPriceHex = '0x' + (2 * 1e9).toString(16);
        const gasLimit = Math.floor(tx.gas * 1.5);
        const gasLimitHex = '0x' + gasLimit.toString(16);
        const tokenAmountHex = '0x' + Number(tokenAmount).toString(16);
        const path = [tokenAddress, weth];
        //const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
        //const deadlineHex = "0x" + deadline.toString(16);
        // const factory = await getUniswapFactoryContract();
        // const pair = await factory.methods.getPair(weth, token).call();
        // const tokenContract = await getERC20Contract(token);
        // const approveTx = await tokenContract.methods.approve(pair, "115792089237316195423570985008687907853269984665640564039457584007913129639935");
        // const signedTx = await web3.eth.accounts.signTransaction(
        //     {
        //         nonce: nonce,
        //         from: account.address,
        //         to: token,
        //         gasPrice: newGasPriceHex,
        //         gas: gasLimitHex,
        //         data: approveTx.encodeABI()
        //     }
        // );
        // const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        // console.log(receipt);
        const contract = await getUniswapContract();
        console.log(tokenAmountHex);
        const sellTx = contract.methods.swapExactTokensForETHSupportingFeeOnTransferTokens(tokenAmountHex, 0, path, account.publicKey, Date.now() + 1000 * 60);
        console.log(gasLimit, newGasPrice);
        const createTx = await web3.eth.accounts.signTransaction(
            {
                nonce: nonce,
                from: account.publicKey,
                to: uniswap.address,
                gasPrice: newGasPriceHex,
                gas: gasLimitHex,
                data: sellTx.encodeABI()
            },
            account.privateKey
        );
        console.log("SELL: ", createTx);
        const createReceipt = await web3.eth.sendSignedTransaction(createTx.rawTransaction);
        console.log(createReceipt);
        console.log("SUCCESS");
    } catch (err) {
        console.log("FAILED");
        console.log(err);
    }
}

export function extractParameters(signature) {
    let params = [];

    const allParameters = /\b[^()]+\((.*)\)$/gm;
    const splitParameters = /((\(.+?\))|([^,() ]+)){1}/gm;

    let _allParameters = allParameters.exec(signature)[1];
    let match;
    while ((match = splitParameters.exec(_allParameters))) {
        params.push(match[0]);
    }

    return params;
}

export function delay(time) {
    return new Promise( res => setTimeout(res, time) );
}