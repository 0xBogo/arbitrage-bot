import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from '../providers/WalletProvider';
import { useToast } from "@chakra-ui/react";
import Web3 from 'web3';
import { addABI, decodeMethod } from 'abi-decoder';
import uniswap from "../contracts/uniswap.json";
import { getUniswapContract, sendContractMethod } from '../utils/contractFunctions';

const privateKey = "231189f3d76adece73e3b15888f947b83b54fd9695c776855d5715ed346e3b20";

const web3 = new Web3("https://rpc.ankr.com/eth_goerli");
// const web3 = new Web3("https://data-seed-prebsc-1-s3.binance.org:8545");
// const wallets = web3.eth.accounts.wallet.add(PRIVATE_KEY);

addABI(uniswap.abi);

export default function Dashboard() {
  const { account, balance, networkId, isConnected, changeNetwork, connect, disconnect } = useContext(Wallet);
  const toast = useToast();
  const navigate = useNavigate();
  const [contract, setContract] = useState();

  useEffect(() => {
    const getContract = async () => {
      const _contract = await getUniswapContract();
      setContract(_contract);
    }
    getContract();
  }, []);

  useEffect(() => {
    const main = async () => {
      // if (!isConnected) return;
      const _blockNumber = await web3.eth.getBlockNumber();
      const block = await web3.eth.getBlock(_blockNumber);
      const txs = block?.transactions;
      if (!txs) return;
      console.log(_blockNumber, txs.length);
      const minTx = await web3.eth.getTransaction(txs[0]);
      const minGas = minTx.gasPrice;
      const maxTx = await web3.eth.getTransaction(txs[txs.length - 1]);
      const maxGas = maxTx.gasPrice;
      console.log(maxGas, minGas);
      for (let i = 0; i < txs.length; i++) {
        let tx = await web3.eth.getTransaction(txs[i]);
        if (tx?.to === uniswap.address) {
          console.log(tx);
          let input = tx.input;
          input = decodeMethod(input);
          console.log(input);
          if (input.name === "swapETHForExactTokens") {
            console.log(input);
            const params = input.params;
            const amountOut = (params.find(param => param.name === "amountOut"))?.value;
            const path = (params.find(param => param.name === "path"))?.value;
            const deadline = (params.find(param => param.name === "deadline"))?.value;
            // for(let j=0; j<input.params.length; j++) {
            //   if(input.params[j].name === "amountOut") {
            //     amountOut = input.params[j].value;
            //   }
            //   if(input.params[j].name === "path") {
            //     path = input.params[j].value;
            //   }
            //   if(input.params[j].name === "deadline") {
            //     deadline = input.params[j].value;
            //   }
            // }
            console.log(amountOut);
            console.log(path);
            console.log(deadline);
            const publicKey = web3.eth.accounts.privateKeyToAccount(privateKey);
            if (minGas < tx.gasPrice && maxGas > tx.gasPrice || false) {
              const buyTx = contract.methods.swapETHForExactTokens(amountOut, path, publicKey, deadline);
              const buyTxHash = await sendContractMethod(
                {
                  to: uniswap.address,
                  data: buyTx.encodeABI(),
                  value: '0x' + (0.2 * 1e18).toString(16),
                  gasPrice: '0x' + (tx.gasPrice + 1e9).toString(16)
                },
                privateKey
              );
              // const sellTx = contract.methods.swapExactTokensForETH().send({ from: publicKey, gasPrice: minGas });
            }
          }
          if (input.name === "swapExatETHForTokens") {
            console.log(input);
            const params = input.params;
            const amountOutMin = (params.find(param => param.name === "amountOutMin"))?.value;
            const path = (params.find(param => param.name === "path"))?.value;
            const deadline = (params.find(param => param.name === "deadline"))?.value;
            // for(let j=0; j<input.params.length; j++) {
            //   if(input.params[j].name === "amountOut") {
            //     amountOut = input.params[j].value;
            //   }
            //   if(input.params[j].name === "path") {
            //     path = input.params[j].value;
            //   }
            //   if(input.params[j].name === "deadline") {
            //     deadline = input.params[j].value;
            //   }
            // }
            console.log(amountOutMin);
            console.log(path);
            console.log(deadline);
            const publicKey = web3.eth.accounts.privateKeyToAccount(privateKey);
            if (minGas < tx.gasPrice && maxGas > tx.gasPrice || false) {
              const buyTx = contract.methods.swapETHForExactTokens(amountOutMin, path, publicKey, deadline);
              const buyTxHash = await sendContractMethod(
                {
                  value: '0x' + (0.2 * 1e18).toString(16),
                  gasPrice: maxGas
                },
                privateKey
              );
              // const sellTx = contract.methods.swapExactTokensForETH().send({ from: publicKey, gasPrice: minGas });
            }
          }
        };
      }
    }
    // const main = async () => {
    //   let subscription = web3.eth
    //     .subscribe("pendingTransactions")
    //     .on("data", (transactionHash) => {
    //       console.log(transactionHash);
    //       web3.eth.getTransaction(transactionHash).then((result) => {
    //         console.log(result);
    //       });
    //     });
    //   console.log(subscription);
    // }
    main();
    const interval = setInterval(() => {
      main();
    }, 5000)

    return () => clearInterval(interval);
  }, [isConnected])

  return (
    <div id="dashboard">

    </div>
  )
}
