import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from "web3";
import { useToast } from "@chakra-ui/react";
import { detectSwap, buyTokens, sellTokens } from '../utils/contractFunctions';
import { GET_ALL_TOKENS, GET_TOKEN, GRAPHQL_URL } from '../utils/constants';

const PRIVATE_KEY = "0x231189f3d76adece73e3b15888f947b83b54fd9695c776855d5715ed346e3b20";
const web3 = new Web3("wss://eth-goerli.g.alchemy.com/v2/Pb1bcfBkLXMRUZqgsbNORkYNJ5v4YnV8");

export default function Contracts() {
  const toast = useToast();
  const navigate = useNavigate();
  const [tokenData, setTokenData] = useState([]);
  const [selectedToken, setSelectedToken] = useState("");
  const [selectedTokenData, setSelectedTokenData] = useState(null);

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

  useEffect(() => {
    const publicKey = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
    const main = async () => {
      let subscription = web3.eth.subscribe('pendingTransactions', function (error, result) { })
        .on("data", function (txHash) {
          console.log(txHash);
          web3.eth.getTransaction(txHash)
            .then(async function (tx) {
              if (tx) {
                const swapInput = await detectSwap(tx);
                if (swapInput) {
                  console.log(tx);
                  console.log(swapInput);
                  const nonceCount = await web3.eth.getTransactionCount(publicKey)
                  // buyTokens(tx, nonceCount + 1, PRIVATE_KEY, publicKey);
                  // sellTokens(tx, nonceCount + 2, tokenAmount, PRIVATE_KEY, publicKey);
                }
              }
            })
            .catch(function () {
              console.log("WARNING! Promise error caught! There is likely an issue on your providers side, with the node you are connecting to.\nStop the bot with CTRL+C and try run again in a few hours.");
            })
        });
    }
    main();
  })

  return (
    <div id="contracts">
      <div className="title">
        Contracts
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
          <div className="header">Chart Link</div>
          <div className="header">Action</div>
          {
            tokenData?.map((item) => (
              <>
                <div className="element">{item.name}</div>
                <div className="element">{item.symbol}</div>
                <a className="element">{item.id}</a>
                <a className="element">Chart Link_1</a>
                <div className="element">
                  <button onClick={() => getSelectedTokenData(item.id)}>Select</button>
                </div>
              </>
            ))
          }

        </div>
      </div>
      <div className="contract-details-section">
        <div className="title">
          Contract Details
        </div>
        <div className="basic">
          <div className="detail-item">
            <div className="title">Contract Name</div>
            <div className="value">{selectedTokenData?.name}</div>
          </div>
          <div className="detail-item">
            <div className="title">Contract Symbol</div>
            <div className="value">{selectedTokenData?.symbol}</div>
          </div>
          <div className="detail-item">
            <div className="title">Contract Address</div>
            <div className="value">{selectedTokenData?.id}</div>
          </div>
          <div className="detail-item">
            <div className="title">Contract Chart Link</div>
            <div className="value">Chart Link_1</div>
          </div>
          <div className="detail-item">
            <div className="title">Contract Liquidity</div>
            <div className="value">{selectedTokenData?.totalLiquidity}</div>
          </div>
          <div className="detail-item">
            <div className="title">Contract MCap</div>
            <div className="value">MCap_1</div>
          </div>
          <div className="detail-item">
            <div className="title">Contract Price</div>
            <div className="value">{selectedTokenData?.tokenDayData[1]?.priceUSD}</div>
          </div>
          <div className="detail-item">
            <div className="title">Buy/Sell Taxes</div>
            <div className="value">3% / 3%</div>
          </div>
        </div>
      </div>

    </div>
  )
}
