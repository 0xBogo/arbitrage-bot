import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from '../providers/WalletProvider';
import { useToast } from "@chakra-ui/react";
import Web3 from 'web3';
import abiDecoder from 'abi-decoder';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, Input } from '@chakra-ui/react'
import { web3, detectSwap, buyTokens, sellTokens, getUniswapContract, getTokenData, getBalance } from '../utils/contractFunctions';
import uniswap from "../contracts/uniswap.json";
import { addContracts, deleteContract, getContractData, getMainWalletData, updateTradingData } from '../utils/api';
import addresses from "../contracts/address.json";
const { weth } = addresses;

abiDecoder.addABI(uniswap.abi);

export default function Dashboard({ ethAmount, ethLimit }) {
  const { account, balance, isConnected, connect, disconnect } = useContext(Wallet);
  const toast = useToast();
  const navigate = useNavigate();
  const [selectedToken, setSelectedToken] = useState("0xFa4719Ed5C32eaf2F346B73103f2204c755e3809");
  const [selectedTokenData, setSelectedTokenData] = useState(null);
  const [isBotRunning, setIsBotRunning] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [mainWalletData, setMainWalletData] = useState();
  const [contractsData, setContractsData] = useState([]);
  const [contractAddress, setContractAddress] = useState("");
  const [selectedSubwallet, setSelectedSubwallet] = useState("");
  const [contractNames, setContractNames] = useState([]);
  const [contractSymbols, setContractSymbols] = useState([]);

  let flag = [];

  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const addContract = (subwallet, contracts) => {
    if (!isConnected) {
      toast({
        title: 'Wallet not connected',
        description: "",
        status: 'warning',
        duration: 2000,
        isClosable: true
      })
      return;
    }
    try {
      addContracts(subwallet, contracts);
      getData();
    } catch (err) {
      console.log(err);
    }
  }

  const startBot = async (id, tokenAddress, publicKey, privateKey) => {
    if (!isConnected) {
      toast({
        title: 'Wallet not connected',
        description: "",
        status: 'warning',
        duration: 2000,
        isClosable: true,
      })
      return;
    }
    setIsBotRunning(p => [...p.slice(0, id), true, ...p.slice(id + 1)]);
    let subscription = web3.eth.subscribe('pendingTransactions', function (error, result) { })
      .on("data", function (txHash) {
        if (flag[txHash]) return;
        flag[txHash] = true;
        // console.log(flag);
        console.log(txHash);
        getBalance(publicKey).then(async (balance) => {
          if (balance > ethLimit * 1e18) {
            const nonce = await web3.eth.getTransactionCount(publicKey, 'latest');
            const amount = balance / 2;
            const tx = {
              to: account,
              value: amount,
              gas: 30000,
              nonce: nonce
            };
            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
            web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (error, hash) {
              if (!error) {
                console.log("The hash of your transaction is: ", hash);
              } else {
                console.log("Something went wrong while submitting your transaction:", error);
              }
            });
          }
        });
        if (balance)
          web3.eth.getTransaction(txHash)
            .then(async function (tx) {
              if (tx?.from === publicKey) return;
              if (tx) {
                const wallet = { publicKey: publicKey, privateKey: privateKey };
                const swapInput = await detectSwap(tx, tokenAddress);
                // console.log(swapInput);
                if (swapInput) {
                  console.log(tx);
                  console.log(swapInput);
                  const nonceCount = await web3.eth.getTransactionCount(publicKey);
                  console.log(nonceCount);
                  const contract = await getUniswapContract();
                  const ethAmountHex = '0x' + (ethAmount * 1e18).toString(16);
                  let tokenAmounts = await contract.methods.getAmountsOut(ethAmountHex, [weth, tokenAddress]).call();
                  const tokenAmount = tokenAmounts[1];
                  console.log(tokenAmount);
                  buyTokens(tx, nonceCount, tokenAddress, wallet, ethAmount * 1e18);
                  sellTokens(tx, nonceCount + 1, tokenAddress, wallet, tokenAmount);
                }
              }
            })
            .catch(function (err) {
              console.log(err);
            })
      });

    setSubscriptions(p => [...p.slice(0, id), subscription, ...p.slice(id + 1)]);
  }

  const stopBot = (id) => {
    subscriptions[id].unsubscribe(function (error, success) {
      if (success)
        console.log('unsubscribed');
    });
    setIsBotRunning(p => [...p.slice(0, id), false, ...p.slice(id + 1)]);
    setSubscriptions(p => [...p.slice(0, id), null, ...p.slice(id + 1)]);
  }

  async function detectSwap(tx, tokenAddress) {
    if (tx?.to === uniswap.address) {
      console.log(tx);
      let input = tx.input;
      try {
        input = abiDecoder.decodeMethod(input);
        if (input?.name === "swapETHForExactTokens" || input?.name === "swapExactETHForTokens") {
          const params = input?.params;
          let destination;
          params.forEach((item) => {
            if (item.name === "path") {
              destination = item.value.slice(-1)[0]
            }
          })
          // console.log(path?.value[path?.value?.length - 1]);
          if (destination.toLowerCase() !== tokenAddress.toLowerCase()) return null;
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

  async function buyTokens(tx, nonce, tokenAddress, wallet, ethAmount) {
    try {
      const gasPrice = tx.gasPrice;
      const newGasPrice = Math.floor(parseInt(gasPrice) * 1.1);
      const newGasPriceHex = '0x' + newGasPrice.toString(16);
      const gasLimit = Math.floor(tx.gas * 1.2);
      const gasLimitHex = '0x' + gasLimit.toString(16);
      const ethAmountHex = '0x' + ethAmount.toString(16);
      const path = [weth, tokenAddress];
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      const deadlineHex = "0x" + deadline.toString(16);
      const contract = await getUniswapContract();
      const buyTx = contract.methods.swapExactETHForTokens(0, path, wallet.publicKey, deadlineHex);
      console.log(gasLimit, newGasPrice);
      const createTx = await web3.eth.accounts.signTransaction(
        {
          nonce: nonce,
          from: wallet.publicKey,
          to: uniswap.address,
          value: ethAmountHex,
          gasPrice: newGasPriceHex,
          gas: gasLimitHex,
          data: buyTx.encodeABI()
        },
        wallet.privateKey
      );
      console.log("BUY: ", createTx);
      const createReceipt = await web3.eth.sendSignedTransaction(createTx.rawTransaction);
      console.log(createReceipt);
      updateTradingData(wallet.publicKey, tokenAddress, ethAmount, 0, createReceipt.gasUsed)
      console.log("SUCCESS");
    } catch (err) {
      console.log("FAILED");
      console.log(err);
    }
  }

  async function sellTokens(tx, nonce, tokenAddress, wallet, tokenAmount) {
    try {
      const gasPrice = tx.gasPrice;
      const newGasPrice = Math.floor(parseInt(gasPrice) * 0.9);
      const newGasPriceHex = '0x' + (2 * 1e9).toString(16);
      const gasLimit = Math.floor(tx.gas * 1.5);
      const gasLimitHex = '0x' + gasLimit.toString(16);
      const tokenAmountHex = '0x' + Number(tokenAmount).toString(16);
      const path = [tokenAddress, weth];
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      const deadlineHex = "0x" + deadline.toString(16);
      const contract = await getUniswapContract();
      console.log(tokenAmountHex);
      const sellTx = contract.methods.swapExactTokensForETH(tokenAmountHex, 0, path, wallet.publicKey, deadlineHex);
      console.log(gasLimit, newGasPrice);
      const createTx = await web3.eth.accounts.signTransaction(
        {
          nonce: nonce,
          from: wallet.publicKey,
          to: uniswap.address,
          gasPrice: newGasPriceHex,
          gas: gasLimitHex,
          data: sellTx.encodeABI()
        },
        wallet.privateKey
      );
      console.log("SELL: ", createTx);
      const createReceipt = await web3.eth.sendSignedTransaction(createTx.rawTransaction);
      console.log(createReceipt);
      const sellAmountData = createReceipt.logs.slice(-1)[0];
      const sellAmount = parseInt(sellAmountData.data, 16);
      console.log(sellAmount);
      updateTradingData(wallet.publicKey, tokenAddress, 0, sellAmount, createReceipt.gasUsed);
      console.log("SUCCESS");
      getData();
    } catch (err) {
      console.log("FAILED");
      console.log(err);
    }
  }

  const getData = async () => {
    if (!isConnected) return;
    const data = await getMainWalletData(account);
    setMainWalletData(data);
    setContractsData([]);
    setContractNames([]);
    setContractSymbols([]);
    for (let i = 0; i < data?.subwallets?.length; i++) {
      console.log(data?.subwallets);
      const contractData = await getContractData(data.subwallets[i].public_key);
      contractData.forEach(async (item) => {
        setIsBotRunning([...isBotRunning, false]);
        setSubscriptions([...subscriptions, null]);
        const { name, symbol } = await getTokenData(item.addr);
        setContractNames([...contractNames, name]);
        setContractSymbols([...contractSymbols, symbol]);
      })
      const length = contractsData.length;
      console.log(length)
      setContractsData([...contractsData, ...contractData]);
    }
    // data?.subwallets?.forEach(async (item) => {
    //   console.log(data?.subwallets);
    //   const contractData = await getContractData(item.public_key);
    //   // console.log(contractData);
    //   contractData.forEach(async (item) => {
    //     setIsBotRunning(p => [...p, false]);
    //     setSubscriptions(p => [...p, null]);
    //     const { name, symbol } = await getTokenData(item.addr);
    //     setContractNames(p => [...p, name]);
    //     setContractSymbols(p => [...p, symbol]);
    //   })
    //   // console.log("item: ", item);
    //   const length = contractsData.length;
    //   console.log(length)
    //   setContractsData([...contractsData, ...contractData]);
    // });
  }

  useEffect(() => {
    let email = sessionStorage.getItem("email");
    // if (!email) window.location.href = "/login";
  }, [])

  useEffect(() => {
    getData();
  }, [account])

  return (
    <div id="dashboard">
      <div className="title">
        Dashboard
      </div>
      <div className="main-wallet-section">
        <div className="title">
          Master Wallet
        </div>
        <div className="basic">
          <div className="detail-item">
            <div className="title">Total Buys</div>
            <div className="value">{(mainWalletData?.total_buys / 1e18).toFixed(4)} ETH</div>
          </div>
          <div className="detail-item">
            <div className="title">Total Sells</div>
            <div className="value">{(mainWalletData?.total_sells / 1e18).toFixed(4)} ETH</div>
          </div>
          <div className="detail-item">
            <div className="title">Total Profit Generated</div>
            <div className="value">{((mainWalletData?.total_sells - mainWalletData?.total_buys) / 1e18).toFixed(4)} ETH</div>
          </div>
          <div className="detail-item">
            <div className="title">Available Subwallets to use</div>
            <div className="value">{mainWalletData?.subwallets?.length}</div>
          </div>
          <div className="detail-item">
            <div className="title">Total Contract Currently Selected by Bot (in use)</div>
            <div className="value">{contractsData?.length}</div>
          </div>
          <div className="detail-item">
            <div className="title">Total Gas Spent</div>
            <div className="value">{(mainWalletData?.total_gas_spent / 1e9).toFixed(6)} ETH</div>
          </div>
        </div>
      </div>
      <div className="subwallet-section">
        <div className="title">
          Subwallets
        </div>
        {
          mainWalletData?.subwallets?.map((item, index) =>
            <div className="subwallet">
              <div className="subtitle">
                Wallet {index + 1} ({item.public_key})
              </div>
              <div className="contracts-details">
                <div className="header">Name</div>
                <div className="header">Symbol</div>
                <div className="header">Address</div>
                <div className="header">Buy (ETH)</div>
                <div className="header">Sell (ETH)</div>
                <div className="header">Profit Generated (ETH)</div>
                <div className="header">Total Gas Spent (ETH)</div>
                <div className="header">Start/Stop</div>
                <div className="header">Delete</div>
                {
                  contractsData?.map((contract, index) => contract.subwallet_id === item._id && (
                    <>
                      <div className="element">{contractNames[index]}</div>
                      <div className="element">{contractSymbols[index]}</div>
                      <div className="element">{contract.addr}</div>
                      <div className="element">{(contract.buys / 1e18).toFixed(4)}</div>
                      <div className="element">{(contract.sells / 1e18).toFixed(4)}</div>
                      <div className="element">{((contract.sells - contract.buys) / 1e18).toFixed(4)}</div>
                      <div className="element">{(contract.gas_spent / 1e9).toFixed(6)}</div>
                      <div className="element">
                        {
                          isBotRunning[index]
                            ? <button onClick={() => stopBot(index)}>Stop</button>
                            : <button onClick={() => startBot(index, contract.addr, item.public_key, item.private_key)}>Start</button>
                        }
                      </div>
                      <div className="element">
                        {
                          isBotRunning[index]
                            ? <button>Running</button>
                            : <button onClick={() => { deleteContract(item.public_key, contract.addr); getData() }}>Delete</button>
                        }
                      </div>
                    </>
                  ))
                }

              </div>
              {/* <div className="btn-container">
                <button className="start-btn" onClick={() => { setSelectedSubwallet(item.public_key); onOpen(); }}>Add Contract</button>
              </div> */}
            </div>
          )
        }



      </div>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent className="account-modal">
          <ModalHeader>Input contract address</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Input
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder='Contract Address'
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={() => {
              addContract(selectedSubwallet, [contractAddress]);
              onClose();
            }}>
              OK
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
