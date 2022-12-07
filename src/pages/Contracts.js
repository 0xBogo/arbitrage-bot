import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from '../providers/WalletProvider';
import { useToast } from "@chakra-ui/react";
import { detectSwap, buyTokens, sellTokens, getUniswapContract, getPairAddress } from '../utils/contractFunctions';
import { GET_ALL_TOKENS, GET_TOKEN, GRAPHQL_URL } from '../utils/constants';
import addresses from "../contracts/address.json";
const { weth } = addresses;

export default function Contracts({accountEmail}) {
  const { account, balance, isConnected, web3, connect, disconnect } = useContext(Wallet);
  const toast = useToast();
  const navigate = useNavigate();
  const [tokenData, setTokenData] = useState([]);
  const [selectedToken, setSelectedToken] = useState("0xFa4719Ed5C32eaf2F346B73103f2204c755e3809");
  const [selectedTokenData, setSelectedTokenData] = useState(null);
  const [pairData, setPairData] = useState([]);
  const [sortOption, setSortOption] = useState("Address");

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

  const sortByName = (isReverse, tokens) => {
    tokens.sort((a, b) => {
      const name1 = a.name.toLowerCase();
      const name2 = b.name.toLowerCase();
      if(name1 < name2) return -1;
      if(name1 > name2) return 1;
      return 0;
    });
    if(isReverse) tokens = tokens.reverse();
    return tokens;
  }

  useEffect(() => {
    if(!accountEmail) window.location.href = "/login";
  })

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
        setPairData([]);
        for (let i = 0; i < characters.data.tokens.length; i++) {
          // console.log(characters.data.tokens[i].id);
          const pairAddress = await getPairAddress(characters.data.tokens[i].id);
          // console.log(pairAddress);
          setPairData([...pairData, pairAddress]);
        }
      } catch (err) {
        console.log(err);
      }
    }
    getTokenData();
  }, [])

  useEffect(() => {
    if(!tokenData) return;
    switch (sortOption) {
      case "Address": {

        break;
      }
      case "Name": {
        console.log("first");
        setTokenData(sortByName(tokenData));
        break;
      }
    }
  }, [tokenData])

  return (
    <div id="contracts">
      <div className="title">
        Contract Details
      </div>
      <div className="contract-list-section">
        <div className="filter">
          <div className="title">
            Sort by
          </div>
          <select onChange={e => setSortOption(e.target.value)}>
            <option value="Address">Address</option>
            <option value="Name">Name</option>
            <option value="Symbol">Symbol</option>
            <option value="Liquidity">Liquidity</option>
            <option value="MCap">MCap</option>
            <option value="Price">Price</option>
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
            tokenData?.map((item, index) => (
              <>
                <div className="element">{item.name}</div>
                <div className="element">{item.symbol}</div>
                <a className="element" >{item.id}</a>
                <a className="element" href={`https://dexscreener.com/ethereum/${pairData[index]}`} target="_blank">WETH/{item.symbol}</a>
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
      {/* <div className="title">
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
      </div> */}
    </div>
  )
}
