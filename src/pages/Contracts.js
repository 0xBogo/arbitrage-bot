import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from '../providers/WalletProvider';
import { useToast } from "@chakra-ui/react";
import { getERC20Contract } from '../utils/contractFunctions';
import { GET_ALL_TOKENS, GET_TOKEN, GRAPHQL_URL } from '../utils/constants';

export default function Contracts() {
  const { account, balance, networkId, web3, isConnected, changeNetwork, connect, disconnect } = useContext(Wallet);
  const toast = useToast();
  const navigate = useNavigate();
  // const { data, loading, error } = useQuery(GET_ALL_TOKENS);
  const [tokenData, setTokenData] = useState([]);
  // const [selectedToken, setSelectedToken] = useState("");
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
    // if (!isConnected) return;
    // tokens?.map(async (tokenAddress) => {
    //   const contract = await getERC20Contract(tokenAddress);
    //   const name = await contract.methods.name().call();
    //   const symbol = await contract.methods.symbol().call();
    //   // const symbol = await contract.methods.symbol().call();

    //   const data = {
    //     name: name,
    //     symbol: symbol,
    //     address: tokenAddress
    //   };
    //   setTokenData((p) => [...p, data]);
    // })

    // return () => setTokenData([]);
  }, [])

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
