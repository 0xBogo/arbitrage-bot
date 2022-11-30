import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from '../providers/WalletProvider';
import { useToast } from "@chakra-ui/react";
import { detectSwap, buyTokens, sellTokens, getUniswapContract } from '../utils/contractFunctions';
import { GET_ALL_TOKENS, GET_TOKEN, GRAPHQL_URL } from '../utils/constants';
import addresses from "../contracts/address.json";
const { weth } = addresses;

export default function Contracts() {
  const { account, balance, isConnected, web3, connect, disconnect } = useContext(Wallet);
  const toast = useToast();
  const navigate = useNavigate();
  const [tokenData, setTokenData] = useState([]);
  const [selectedToken, setSelectedToken] = useState("0xFa4719Ed5C32eaf2F346B73103f2204c755e3809");
  const [selectedTokenData, setSelectedTokenData] = useState(null);
  const [ethAmount, setEthAmount] = useState(0.05);
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [flag, setFlag] = useState([]);

  const getSelectedTokenData = async (address) => {
    // console.log(GET_TOKEN(address));
    try {
      let results = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: GET_TOKEN(address)
        })
      })
      let characters = await results.json();
      setSelectedTokenData(characters.data.token);
      setSelectedToken(characters.data.token.id);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const getTokenData = async () => {
      try {
        let results = await fetch(GRAPHQL_URL, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            query: GET_ALL_TOKENS
          })
        })
        let characters = await results.json();
        setTokenData(characters.data.tokens);
      } catch (err) {
        console.log(err);
      }
    }
    getTokenData();
  }, [])

  const startBot = async () => {
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
    setIsBotRunning(true);
    let subscription = web3.eth.subscribe('pendingTransactions', function (error, result) { })
      .on("data", function (txHash) {
        if (flag[txHash]) return;
        flag[txHash] = true;
        // console.log(flag);
        // console.log(txHash);
        web3.eth.getTransaction(txHash)
          .then(async function (tx) {
            if (tx?.from === account.address) return;
            if (tx) {
              const swapInput = await detectSwap(tx, account);
              // console.log(swapInput);
              if (swapInput) {
                console.log(tx);
                console.log(swapInput);
                const nonceCount = await web3.eth.getTransactionCount(account.address);
                console.log(nonceCount);
                const contract = await getUniswapContract();
                const ethAmountHex = '0x' + (ethAmount * 1e18).toString(16);
                let tokenAmounts = await contract.methods.getAmountsOut(ethAmountHex, [weth, selectedToken]).call();
                const tokenAmount = tokenAmounts[1];
                console.log(tokenAmount);
                buyTokens(tx, nonceCount, selectedToken, account, ethAmountHex);
                sellTokens(tx, nonceCount + 1, selectedToken, account, tokenAmount);
              }
            }
          })
          .catch(function (err) {
            console.log(err);
          })
      });
    setSubscription(subscription);
  }

  const stopBot = () => {
    subscription.unsubscribe(function (error, success) {
      if (success)
        console.log('unsubscribed');
    });
    setIsBotRunning(false);
  }

  return (
    <div id="contracts">
      <div className="title">
        Contract Details
      </div>
      <div className="contract-list-section">
        <div className="filter">
          <div className="title">
            Filter
          </div>
          <select>
            <option value="Option1">Option1</option>
            <option value="Option2">Option2</option>
            <option value="Option3">Option3</option>
          </select>
        </div>
        <div className="contract-list">
          <div className="header">Name</div>
          <div className="header">Symbol</div>
          <div className="header">Address</div>
          <div className="header">Chart</div>
          <div className="header">Liquidity</div>
          <div className="header">MCap</div>
          <div className="header">Price</div>
          <div className="header">Buy/Sell Taxes</div>
          <div className="header">Action</div>
          {
            tokenData?.map((item) => (
              <>
                <div className="element">{item.name}</div>
                <div className="element">{item.symbol}</div>
                <a className="element" >{item.id}</a>
                <a className="element" href={`https://dexscreener.com/ethereum/0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640`} target="_blank">WETH/{item.symbol}</a>
                <div className="element">{item.totalLiquidity}</div>
                <div className="element">{item.symbol}</div>
                <div className="element">{item.tokenDayData[1]?.priceUSD}</div>
                <div className="element">0% / 0%</div>
                <div className="element">
                  <button onClick={() => getSelectedTokenData(item.id)}>Select</button>
                </div>
              </>
            ))
          }
        </div>
      </div>
      <div className="title">
        Selected Contracts
      </div>
      <div className="contract-wallet-section">
        <div className="contract-list">
          <div className="header">Name</div>
          <div className="header">Symbol</div>
          <div className="header">Address</div>
          <div className="header">Wallet</div>
          {
            tokenData?.map((item) => (
              <>
                <div className="element">{item.name}</div>
                <div className="element">{item.symbol}</div>
                <a className="element">{item.id}</a>
                <select className="element">
                  <option value="Option1">Option1</option>
                  <option value="Option2">Option2</option>
                  <option value="Option3">Option3</option>
                </select>
              </>
            ))
          }

        </div>
        <div className="btn-container">
          {
            isBotRunning
              ? <button className="start-btn" onClick={stopBot}>Stop Bot</button>
              : <button className="start-btn" onClick={startBot}>Start Bot</button>
          }

        </div>
      </div>

    </div>
  )
}
