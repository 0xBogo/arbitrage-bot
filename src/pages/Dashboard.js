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

  return (
    <div id="dashboard">

    </div>
  )
}
