import { useEffect, useState, useCallback, createContext } from 'react';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { useToast } from '@chakra-ui/react';
import networks from "../providers/networks.json";
import { addMainWallet } from '../utils/api';

export const Wallet = createContext({
    account: null,
    balance: null,
    networkId: null,
    web3: null,
    isConnected: null,
    changeNetwork: () => { },
    connect: () => { },
    disconnect: () => { }
});

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
            infuraId: "INFURA_ID", // required
        },
    },
    coinbasewallet: {
        package: CoinbaseWalletSDK, // Required
        options: {
            appName: "web3modal", // Required
            infuraId: "INFURA_ID", // Required
            rpc: "", // Optional if `infuraId` is provided; otherwise it's required
            chainId: 1, // Optional. It defaults to 1 if not provided
            darkMode: false, // Optional. Use dark theme, defaults to false
        },
    },
    binancechainwallet: {
        package: true,
    },
};

const WalletProvider = ({ children }) => {

    const [account, setAccount] = useState();
    const [balance, setBalance] = useState();
    const [networkId, setNetworkId] = useState();
    const [web3, setWeb3] = useState();
    const [isConnected, setIsConnected] = useState(false);
    const toast = useToast();

    const changeNetwork = async (_id) => {
        const web3Modal = new Web3Modal({
            network: "mainnet",
            cacheProvider: true,
            providerOptions,
        });
        const provider = await web3Modal.connect();
        const web3 = new Web3(provider);

        // change network
        try {
            await web3.currentProvider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: `0x${_id.toString(16)}` }],
            });
            loadWallet();
        } catch (err) {
            toast({
                title: 'This network does not exist',
                description: "Will add to your metamask automatically.",
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
            if (err.code === 4902) {
                try {
                    await web3.currentProvider.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            networks[_id]
                        ],
                    });
                } catch (err) {
                    toast({
                        title: 'Something went wrong',
                        description: "Please ensure the metamask has been installed.",
                        status: 'error',
                        duration: 2000,
                        isClosable: true,
                    })
                    console.log(err);
                }
            }
        }
    }

    const loadWallet = async () => {
        const web3Modal = new Web3Modal({
            network: "mainnet",
            cacheProvider: true,
            providerOptions,
        });
        try {
            const provider = await web3Modal.connect();
            const web3 = new Web3(provider);
            const _account = await web3.eth.getAccounts();
            const _networkId = await web3.eth.getChainId();
            const _balance = await web3.eth.getBalance(_account[0]);
            setAccount(_account[0]);
            setBalance(_balance);
            setNetworkId(_networkId);
            setWeb3(web3);
            setIsConnected(true);
        } catch (err) {
            console.log(err)
        }
    }

    const connect = async () => {
        const web3Modal = new Web3Modal({
            network: "mainnet",
            cacheProvider: true,
            providerOptions
        });
        try {
            const provider = await web3Modal.connect();
            const web3 = new Web3(provider);
            const _account = await web3.eth.getAccounts();
            const _networkId = await web3.eth.getChainId();
            const _balance = await web3.eth.getBalance(_account[0]);
            setAccount(_account[0]);
            setBalance(_balance);
            setNetworkId(_networkId);
            setWeb3(web3);
            setIsConnected(true);
            addMainWallet(_account[0]);
        } catch (err) {
            toast({
                title: 'Wallet connection failed',
                description: "",
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }

    const disconnect = () => {
        const web3Modal = new Web3Modal();
        web3Modal.clearCachedProvider();
        setAccount(null);
        setBalance(null);
        setNetworkId(null);
        setWeb3(null);
        setIsConnected(false);
    }

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("chainChanged", () => {
                loadWallet();
            });
            window.ethereum.on("accountsChanged", () => {
                loadWallet();
            });
        }
    }, []);

    useEffect(() => {
        connect();
    }, [])

    return (
        <Wallet.Provider value={{ account, balance, networkId, web3, isConnected, changeNetwork, connect, disconnect }}>
            {children}
        </Wallet.Provider>
    )
}

export default WalletProvider;