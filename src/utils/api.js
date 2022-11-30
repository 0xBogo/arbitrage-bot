import axios from "axios"
const server = "http://localhost:5000";

export const addMainWallet = async (publicKey) => {
    try {
        await axios.post(server + "/add/main_wallet", { publicKey: publicKey });
        console.log("success");
    } catch (err) {
        console.log(err.message);
    }
}

export const addSubwallet = async (mainWallet, publicKey, privateKey) => {
    try {
        await axios.post(server + "/add/subwallet", { mainWallet: mainWallet, publicKey: publicKey, privateKey: privateKey });
        console.log("success");
    } catch (err) {
        console.log(err.message);
    }
}

export const getMainWalletData = async (publicKey) => {
    try {
        const mainWalletData = await axios.post(server + "/get/main_wallet", { publicKey: publicKey });
        console.log("success");
        return mainWalletData.data;
    } catch (err) {
        console.log(err.message);
    }
}

export const getAllMainWallets = async () => {
    try {
        const allMainWalletsData = await axios.post(server + "/get/main_wallets");
        console.log("success");
        return allMainWalletsData.data;
    } catch (err) {
        console.log(err.message);
    }
}

export const getAllSubwallets = async () => {
    try {
        const allSubwalletsData = await axios.post(server + "/get/subwallets");
        console.log("success");
        return allSubwalletsData.data;
    } catch (err) {
        console.log(err.message);
    }
}