import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from '../providers/WalletProvider';
import { useToast } from "@chakra-ui/react";
import Web3 from 'web3';
import { addABI, decodeMethod } from 'abi-decoder';
import uniswap from "../contracts/uniswap.json";

// const PRIVATE_KEY = "231189f3d76adece73e3b15888f947b83b54fd9695c776855d5715ed346e3b20";

// const web3 = new Web3("https://rpc.ankr.com/eth_goerli");
// // const web3 = new Web3("https://data-seed-prebsc-1-s3.binance.org:8545");
// const wallets = web3.eth.accounts.wallet.add(PRIVATE_KEY);

addABI(uniswap.abi);

export default function Dashboard() {
  const { account, balance, networkId, isConnected, changeNetwork, connect, disconnect } = useContext(Wallet);
  const toast = useToast();
  const navigate = useNavigate();
  const [contract, setContract] = useState(0);

  // useEffect(() => {
  //   const getContract = async () => {
  //     const _contract = await new web3.eth.Contract(uniswap.abi, uniswap.address);
  //     setContract(_contract);
  //   }
  //   getContract();
  // }, []);

  // useEffect(() => {
  //   const main = async () => {
  //     if (!isConnected) return;
  //     const _blockNumber = await web3.eth.getBlockNumber();
  //     const block = await web3.eth.getBlock(_blockNumber);
  //     const txs = block?.transactions;
  //     console.log(_blockNumber, txs.length);
  //     // const minTx = await web3.eth.getTransaction(txs[0]);
  //     // const minGas = minTx.gasPrice;
  //     // const maxTx = await web3.eth.getTransaction(txs[txs]);
  //     // const maxGas = maxTx.gasPrice;
  //     const results = txs.filter(tx => tx.to === uniswap.address);
  //     for (let i = 0; i < results.length; i++) {
  //       let tx = await web3.eth.getTransaction(results[i]);
  //       console.log(tx);
  //       let input = tx.input;
  //       input = decodeMethod(input);
  //       if (input.name === "swapETHForExactTokens") {
  //         console.log(input);
  //         const params = input.params;
  //         const amountOut = (params.find(param => param.name === "amountOut"))?.value;
  //         const path = (params.find(param => param.name === "path"))?.value;
  //         const deadline = (params.find(param => param.name === "deadline"))?.value;
  //         // for(let j=0; j<input.params.length; j++) {
  //         //   if(input.params[j].name === "amountOut") {
  //         //     amountOut = input.params[j].value;
  //         //   }
  //         //   if(input.params[j].name === "path") {
  //         //     path = input.params[j].value;
  //         //   }
  //         //   if(input.params[j].name === "deadline") {
  //         //     deadline = input.params[j].value;
  //         //   }
  //         // }
  //         console.log(amountOut);
  //         console.log(path);
  //         console.log(deadline);
  //         // if(minGas < tx.gasPrice && maxGas > tx.gasPrice) {
  //         //   contract.methods.swapETHForExactTokens(amountOut, path, wallets.address, deadline).send({from: wallets.address, value: '0x' + (0.5 * 1e18).toString(16), gasPrice: maxGas});
  //         //   contract.methods.swapExactTokensForETH().send({from: wallets.address, gasPrice: minGas});
  //         // }
  //       };
  //     }
  //     main();
  //   }
  //   main();
  //   // const interval = setInterval(() => {
  //   //   main();
  //   // }, 2000)

  //   // return () => clearInterval(interval);
  // }, [isConnected])

  return (
    <div id="dashboard">

    </div>
  )
}
