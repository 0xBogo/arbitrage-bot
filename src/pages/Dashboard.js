import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from '../providers/WalletProvider';
import { useToast } from "@chakra-ui/react";
import Web3 from 'web3';
import abiDecoder from 'abi-decoder';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, Input } from '@chakra-ui/react'
import { web3, detectSwap, buyTokens, sellTokens, getUniswapContract, getTokenData, getBalance, getERC20Contract } from '../utils/contractFunctions';
import uniswap from "../contracts/uniswap.json";
import { addContracts, deleteContract, getContractData, getMainWalletData, updateTradingData } from '../utils/api';
import addresses from "../contracts/address.json";
const { weth } = addresses;

abiDecoder.addABI(uniswap.abi);

export default function Dashboard({ contractsData, setContractsData, mainWalletData, getData }) {
  const { account, balance, isConnected, connect, disconnect } = useContext(Wallet);
  const toast = useToast();
  const navigate = useNavigate();
  const [ethAmount, setEthAmount] = useState();
  const [ethLimit, setEthLimit] = useState();
  // const [mainWalletData, setMainWalletData] = useState();
  // const [contractsData, setContractsData] = useState([]);
  const [contractAddress, setContractAddress] = useState("");
  const [selectedSubwallet, setSelectedSubwallet] = useState("");
  const [flag, setFlag] = useState(true);
  // let flag = [];

  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const addContract = async (subwallet, contracts) => {
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
      await addContracts(subwallet, contracts);
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
    if (!ethAmount || !ethLimit) {
      toast({
        title: 'Bot setting error',
        description: "Please make sure values are over 0",
        status: 'warning',
        duration: 2000,
        isClosable: true,
      })
      navigate("/settings");
      return;
    }
    setContractsData(p => [...p.slice(0, id), { ...p[id], isBotRunning: true }, ...p.slice(id + 1)]);
    console.log("bot running");
    let subscription = web3.eth.subscribe('pendingTransactions', function (error, result) { })
      .on("data", function (txHash) {
        // if (flag[txHash]) return;
        // flag[txHash] = true;
        // console.log(txHash);
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
          if (balance > ethAmount * 1e18)
            web3.eth.getTransaction(txHash)
              .then(async function (tx) {
                if (tx?.from === publicKey) return;
                if (tx) {
                  const wallet = { publicKey: publicKey, privateKey: privateKey };
                  const swapInput = await detectSwap(tx, tokenAddress);
                  if (swapInput && flag) {
                    // console.log(tx);
                    console.log(swapInput);
                    const nonceCount = await web3.eth.getTransactionCount(publicKey);
                    // console.log(nonceCount);
                    const contract = await getUniswapContract();
                    // console.log(contract);
                    const ethAmountHex = '0x' + (ethAmount * 1e18).toString(16);
                    // let tokenAddress = swapInput.params[1].value.slice(-1)[0];
                    console.log(ethAmountHex, tokenAddress);
                    // let tokenAmounts = await contract.methods.getAmountsOut(ethAmountHex, [weth, tokenAddress]).call();
                    // const tokenAmount = tokenAmounts[1];
                    //console.log(tokenAmount);
                    await buyTokens(tx, nonceCount, tokenAddress, wallet, ethAmount * 1e18);
                    const tokenContract = await getERC20Contract(tokenAddress);
                    const tokenAmount = await tokenContract.methods.balanceOf(wallet.publicKey).call();
                    sellTokens(tx, nonceCount + 1, tokenAddress, wallet, tokenAmount);
                  }
                }
              })
              .catch(function (err) {
                console.log(err);
              })
        });

      });
    setContractsData(p => [...p.slice(0, id), { ...p[id], subscription: subscription }, ...p.slice(id + 1)]);
  }

  const stopBot = (id) => {
    contractsData[id].subscription.unsubscribe(function (error, success) {
      if (success)
        console.log('bot stopped');
    });
    setContractsData(p => [...p.slice(0, id), { ...p[id], isBotRunning: false, subscription: null }, ...p.slice(id + 1)]);
    // setIsBotRunning(p => [...p.slice(0, id), false, ...p.slice(id + 1)]);
    // setSubscriptions(p => [...p.slice(0, id), null, ...p.slice(id + 1)]);
  }

  async function detectSwap(tx, tokenAddress) {
    if (tx?.to === uniswap.address) {
      console.log(tx);
      let input = tx.input;
      try {
        input = abiDecoder.decodeMethod(input);
        console.log(input)
        if (input?.name === "swapETHForExactTokens" || input?.name === "swapExactETHForTokens") {
          const params = input?.params;
          let destination;
          params.forEach((item) => {
            if (item.name === "path") {
              destination = item.value.slice(-1)[0];
            }
          })
          // console.log(path?.value[path?.value?.length - 1]);
          if (destination.toLowerCase() !== tokenAddress.toLowerCase()) return null;
          console.log("swap transaction detected");
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
      //const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      //const deadlineHex = "0x" + deadline.toString(16);
      const contract = await getUniswapContract();
      const buyTx = contract.methods.swapExactETHForTokens(0, path, wallet.publicKey, Date.now() + 1000 * 60);
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
      setFlag(false);
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
      console.log(tokenAmount);
      const gasPrice = tx.gasPrice;
      const newGasPrice = Math.floor(parseInt(gasPrice) * 0.9);
      const newGasPriceHex = '0x' + newGasPrice.toString(16);
      const gasLimit = Math.floor(tx.gas * 1.5);
      const gasLimitHex = '0x' + gasLimit.toString(16);
      const tokenAmountHex = '0x' + Number(tokenAmount).toString(16);
      const path = [tokenAddress, weth];
      //const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      //const deadlineHex = "0x" + deadline.toString(16);
      const contract = await getUniswapContract();
      console.log(tokenAmountHex);
      const sellTx = contract.methods.swapExactTokensForETH(tokenAmount, 0, path, wallet.publicKey, Date.now() + 1000 * 60);
      console.log(gasLimit, newGasPrice);
      const createTx = await web3.eth.accounts.signTransaction(
        {
          nonce: nonce,
          // from: wallet.publicKey,
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
      await updateTradingData(wallet.publicKey, tokenAddress, 0, sellAmount, createReceipt.gasUsed);
      console.log("SUCCESS");
      setFlag(true);
      getData();
    } catch (err) {
      console.log("FAILED");
      console.log(err);
    }
  }

  useEffect(() => {
    let email = sessionStorage.getItem("email");
    if (!email) window.location.href = "/login";
  }, [])

  useEffect(() => {
    let ethAmount = sessionStorage.getItem("ethAmount");
    let ethLimit = sessionStorage.getItem("ethLimit");
    if (ethAmount) setEthAmount(ethAmount);
    if (ethLimit) setEthLimit(ethLimit);
  }, [])

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
                      <div className="element">{contract.name}</div>
                      <div className="element">{contract.symbol}</div>
                      <div className="element">{contract.addr}</div>
                      <div className="element">{(contract.buys / 1e18).toFixed(4)}</div>
                      <div className="element">{(contract.sells / 1e18).toFixed(4)}</div>
                      <div className="element">{((contract.sells - contract.buys) / 1e18).toFixed(4)}</div>
                      <div className="element">{(contract.gas_spent / 1e9).toFixed(6)}</div>
                      <div className="element">
                        {
                          contract.isBotRunning
                            ? <button onClick={() => stopBot(index)}>Stop</button>
                            : <button onClick={() => startBot(index, contract.addr, item.public_key, item.private_key)}>Start</button>
                        }
                      </div>
                      <div className="element">
                        {
                          contract.isBotRunning
                            ? <button>Running</button>
                            : <button onClick={async () => { await deleteContract(item.public_key, contract.addr); getData() }}>Delete</button>
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
