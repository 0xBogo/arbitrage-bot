import Web3 from "web3";
import marketplace from "../contracts/marketplace.json";
import erc721ABI from "../contracts/erc-721.abi.json";

const web3 = new Web3(window.ethereum);

export const getMarketplaceContract = async (_id) => {
    const _contract = await _getContract(marketplace.address[_id], marketplace.abi);
    return _contract;
}

export const getERC721Contract = async (address) => {
    const _contract = await _getContract(address, erc721ABI);
    return _contract;
}

const _getContract = async (address, abi) => {
    const _contract = await new web3.eth.Contract(abi, address);
    return _contract;
}