import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from '../providers/WalletProvider';
import { useToast } from "@chakra-ui/react";
import { addContracts, getContractData, getMainWalletData, updateTradingData } from '../utils/api';
import { web3, detectSwap, buyTokens, sellTokens, getUniswapContract, getTokenData, getBalance } from '../utils/contractFunctions';
import uniswap from "../contracts/uniswap.json";

export default function Stats({ contractsData }) {
  const { account, balance, isConnected, connect, disconnect } = useContext(Wallet);
  const [mainWalletData, setMainWalletData] = useState();
  const [walletBalances, setWalletBalances] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let email = sessionStorage.getItem("email");
    if (!email) window.location.href = "/login";
  }, [])

  const getData = async () => {
    const data = await getMainWalletData(account);
    setMainWalletData(data);

    let balances = [];
    for (let i = 0; i < data?.subwallets?.length; i++) {
      const balance = await getBalance(data.subwallets[i].public_key);
      balances = [...balances, balance];
    }
    setWalletBalances([...balances]);
  }

  useEffect(() => {
    getData();
    const interval = setInterval(() => getData(), 10000);
    console.log(contractsData)
    return () => clearInterval(interval);
  }, [contractsData])

  return (
    <div id="stats">
      <div className="title">
        Statistics
      </div>
      <div className="total-stats-section">
        <div className="title">
          Total Stats
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

      <div className="wallet-stats-section">
        <div className="title">Wallet Stats</div>
        <div className="container">
          <div className="stat-list">
            <div className="header">Account</div>
            <div className="header">Balance (ETH)</div>
            {/* <div className="header">Contract Amount</div> */}
            <div className="header">Buy (ETH)</div>
            <div className="header">Sell (ETH)</div>
            <div className="header">Profit Generated (ETH)</div>
            <div className="header">Total Gas Spent (ETH)</div>

            {
              mainWalletData?.subwallets?.map((item, index) => (
                <>
                  <div className="element">{item.public_key}</div>
                  <div className="element">{(walletBalances[index] / 1e18).toFixed(4)}</div>
                  {/* <div className="element">1.234</div> */}
                  <div className="element">{(item.buys / 1e18).toFixed(4)}</div>
                  <div className="element">{(item.sells / 1e18).toFixed(4)}</div>
                  <div className="element">{((item.sells - item.buys) / 1e18).toFixed(4)}</div>
                  <div className="element">{((item.gas_spent) / 1e9).toFixed(6)}</div>
                </>
              ))
            }
          </div>
        </div>
      </div>

      <div className="contract-stats-section">
        <div className="title">Contract Stats</div>
        <div className="container">
          <div className="stat-list">
            <div className="header">Name</div>
            <div className="header">Symbol</div>
            <div className="header">Address</div>
            <div className="header">Buy (ETH)</div>
            <div className="header">Sell (ETH)</div>
            <div className="header">Profit Generated (ETH)</div>
            <div className="header">Total Gas Spent (ETH)</div>
            {/* <div className="header">Action</div> */}

            {
              contractsData?.map((item, index) => (
                <>
                  <div className="element">{item.name}</div>
                  <div className="element">{item.symbol}</div>
                  <div className="element">{item.addr}</div>
                  <div className="element">{(item.buys / 1e18).toFixed(4)}</div>
                  <div className="element">{(item.sells / 1e18).toFixed(4)}</div>
                  <div className="element">{((item.sells - item.buys) / 1e18).toFixed(4)}</div>
                  <div className="element">{(item.gas_spent / 1e9).toFixed(6)}</div>
                  {/* <div className="element">
                    {
                      isBotRunning[index]
                        ? <button onClick={() => stopBot(index)}>Stop</button>
                        : <button onClick={() => startBot(index, contract.addr, item.public_key, item.private_key)}>Start</button>
                    }
                  </div> */}
                </>
              ))
            }

          </div>
        </div>
      </div>

    </div>
  )
}
