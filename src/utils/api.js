import axios from "axios"
const server = "https://sandwitchbackend.vercel.app";
// const server = "http://localhost:5000";

export const addMainWallet = async (publicKey) => {
    try {
        await axios.post(server + "/add/main_wallet", { publicKey: publicKey });
        // console.log("success");
    } catch (err) {
        console.log(err.message);
    }
}

export const addSubwallet = async (mainWallet, publicKey, privateKey) => {
    try {
        await axios.post(server + "/add/subwallet", { mainWallet: mainWallet, publicKey: publicKey, privateKey: privateKey });
        // console.log("success");
    } catch (err) {
        console.log(err.message);
    }
}

export const addContracts = async (subwallet, contracts) => {
    try {
        await axios.post(server + "/add/contracts", { subwallet: subwallet, contracts: contracts });
        console.log("success");
    } catch (err) {
        console.log(err.message);
    }
}

export const updateTradingData = async (subwallet, contract, buy, sell, gasSpent) => {
    try {
        await axios.post(server + "/update", { subwallet: subwallet, contract: contract, buy: buy, sell: sell, gasSpent: gasSpent });
        // console.log("success");
    } catch (err) {
        console.log(err.message);
    }
}

export const getMainWalletData = async (publicKey) => {
    try {
        const mainWalletData = await axios.post(server + "/get/main_wallet", { publicKey: publicKey });
        // console.log(mainWalletData);
        return mainWalletData.data;
    } catch (err) {
        console.log(err);
    }
}

export const getAllMainWallets = async () => {
    try {
        const allMainWalletsData = await axios.post(server + "/get/main_wallets");
        // console.log("success");
        return allMainWalletsData.data;
    } catch (err) {
        console.log(err.message);
    }
}

export const getAllSubwallets = async () => {
    try {
        const allSubwalletsData = await axios.post(server + "/get/subwallets");
        // console.log("success");
        return allSubwalletsData.data;
    } catch (err) {
        console.log(err.message);
    }
}

export const getContractData = async (subwallet) => {
    try {
        const contractData = await axios.post(server + "/get/wallet_contracts", { subwallet: subwallet });
        // console.log("success");
        return contractData.data;
    } catch (err) {
        console.log(err.message);
    }
}

export const addUser = async (email, pwd) => {
    try {
        const result = await axios.post(server + "/add/user", { email: email, pwd: pwd });
        // console.log("success");
        return result.data;
    } catch (err) {
        console.log(err.message);
    }
}

export const verifyUser = async (email, pwd) => {
    try {
        const result = await axios.post(server + "/verify/user", { email: email, pwd: pwd });
        // console.log("success");
        return result.data.state;
    } catch (err) {
        console.log(err.message);
    }
}

export const deleteSubwallet = async (publicKey) => {
    try {
        await axios.post(server + "/delete/subwallet", { publicKey: publicKey });
        // console.log("success");
    } catch (err) {
        console.log(err.message);
    }
}

export const deleteContract = async (publicKey, contract) => {
    try {
        await axios.post(server + "/delete/contract", { subwallet: publicKey, contract: contract});
        console.log("success");
    } catch (err) {
        console.log(err.message);
    }
}