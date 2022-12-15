import { useState, useEffect, useContext, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { web3, detectSwap, buyTokens, sellTokens, getUniswapContract, getTokenData, getBalance } from './utils/contractFunctions';
import { addContracts, deleteContract, getContractData, getMainWalletData, updateTradingData } from './utils/api';
import { getPairInformationByChain } from 'dexscreener-api';
import { GET_ALL_TOKENS, GRAPHQL_URL } from './utils/constants';
import { Wallet } from './providers/WalletProvider';
import { ChakraProvider } from '@chakra-ui/react';
import './assets/style/styles.scss';
import Layout from './layouts';
import Dashboard from './pages/Dashboard';
import Contracts from './pages/Contracts';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import Logup from './pages/Logup';
import Login from './pages/Login';

function App() {
  const { account, balance, isConnected, connect, disconnect } = useContext(Wallet);

  const [mainWalletData, setMainWalletData] = useState();
  const [contractsData, setContractsData] = useState([]);

  const [rawTokenData, setRawTokenData] = useState([]);
  const [tokenData, setTokenData] = useState([]);

  const getData = async () => {
    if (!isConnected) return;
    let temp = [];
    const data = await getMainWalletData(account);
    setMainWalletData(data);
    for (let i = 0; i < data?.subwallets?.length; i++) {
      const contractData = await getContractData(data.subwallets[i].public_key);
      // console.log(contractData);
      let contract = [];
      for (let j = 0; j < contractData.length; j++) {
        let token = null;
        try {
          token = await getTokenData(contractData[j].addr);
        } catch (err) {

        }
        if (!token) continue;
        // console.log("contracts data: ", contractsData);
        const oldContract = contractsData?.filter(data => data.addr === contractData[j].addr && data.subwallet_id === contractData[j].subwallet_id);
        // console.log("old contract: ", oldContract);
        if (oldContract?.length) {
          contract = [...contract, { ...contractData[j], name: token.name, symbol: token.symbol, isBotRunning: oldContract[0].isBotRunning, subscription: oldContract[0].subscription }];
        } else {
          contract = [...contract, { ...contractData[j], name: token.name, symbol: token.symbol, isBotRunning: false, subscription: null }];
        }
        // console.log(contract);
      }
      temp = [...temp, ...contract];
    }
    setContractsData([...temp]);
  }

  useEffect(() => {
    if (!account) return;
    getData();
  }, [account]);

  useEffect(() => {
    const getTokenData = async () => {
      for (let k = 0; k < 100; k++) {
        try {
          let tokenData_temp = [];
          let results = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              query: GET_ALL_TOKENS(k)
            })
          })
          const characters = await results.json();
          const data = characters.data?.tokens;
          for (let i = 0; i < data?.length; i++) {
            if (data[i].pairBase.length === 0) continue;
            let pairRes = null;
            try {
              pairRes = await getPairInformationByChain("ethereum", data[i].pairBase[0].id);
            } catch (err) {
              // console.log(err);
            }
            if (!pairRes) continue;
            const pairData = pairRes.pair;
            // console.log(pairData);
            if (!pairData || !pairData.liquidity || !pairData.fdv || pairData.fdv < 1000 || !pairData.volume.h24 || pairData.volume.h24 < 100) continue;
            tokenData_temp = [...tokenData_temp, { ...data[i], ...pairData }];
            // console.log(tokenData_temp);
            setRawTokenData([...rawTokenData, ...tokenData_temp]);
            setTokenData([...tokenData, ...tokenData_temp]);
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
    getTokenData();
  }, [])

  return (
    <ChakraProvider>
      <Layout>
        <Routes>
          <Route index element={<Dashboard contractsData={contractsData} setContractsData={setContractsData} mainWalletData={mainWalletData} getData={getData} />} />
          <Route path="/contracts" element={<Contracts tokenData={tokenData} setTokenData={setTokenData} rawTokenData={rawTokenData} />} />
          <Route path="/stats" element={<Stats contractsData={contractsData} />} />
          <Route path="/settings" element={<Settings getMainData={getData} />} />
          <Route path="/logup" element={<Logup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
    </ChakraProvider>
  );
}

export default App;
