import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from '../providers/WalletProvider';
import { useToast } from "@chakra-ui/react";
import { addContracts, getContractData, getMainWalletData, updateTradingData } from '../utils/api';
import { web3, detectSwap, buyTokens, sellTokens, getUniswapContract, getTokenData, getBalance } from '../utils/contractFunctions';
import uniswap from "../contracts/uniswap.json";

export default function Stats() {
  const { account, balance, isConnected, connect, disconnect } = useContext(Wallet);
  const [ethAmount, setEthAmount] = useState(0.05);
  const [isBotRunning, setIsBotRunning] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [mainWalletData, setMainWalletData] = useState();
  const [contractsData, setContractsData] = useState([]);
  const [contractAddress, setContractAddress] = useState("");
  const [selectedSubwallet, setSelectedSubwallet] = useState("");
  const [contractNames, setContractNames] = useState([]);
  const [contractSymbols, setContractSymbols] = useState([]);
  const [walletBalances, setWalletBalances] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  const getData = async () => {
    if (!isConnected) return;
    const data = await getMainWalletData(account);
    setMainWalletData(data);
    setContractsData([]);
    setContractNames([]);
    setContractSymbols([]);
    setWalletBalances([]);
    data?.subwallets?.forEach(async (item) => {
      console.log(data?.subwallets);
      const balance = await getBalance(item.public_key);
      const contractData = await getContractData(item.public_key);
      // console.log(contractData);
      contractData.forEach(async (item) => {
        setIsBotRunning(p => [...p, false]);
        setSubscriptions(p => [...p, null]);
        const { name, symbol } = await getTokenData(item.addr);
        setContractNames(p => [...p, name]);
        setContractSymbols(p => [...p, symbol]);
      })
      // console.log("item: ", item);
      setWalletBalances(p => [...p, balance]);
      setContractsData(p => [...p, ...contractData]);
    });
  }

  useEffect(() => {
    getData();
  }, [account])

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
          {/* <div className="filter">
            <div className="title">
              Filter
            </div>
            <select>
              <option value="Option1">Option1</option>
              <option value="Option2">Option2</option>
              <option value="Option3">Option3</option>
            </select>
          </div> */}
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
          {/* <div className="filter">
            <div className="title">
              Filter
            </div>
            <select>
              <option value="Option1">Option1</option>
              <option value="Option2">Option2</option>
              <option value="Option3">Option3</option>
            </select>
          </div> */}
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
                  <div className="element">{contractNames[index]}</div>
                  <div className="element">{contractSymbols[index]}</div>
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
