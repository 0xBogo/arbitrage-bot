import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from '../providers/WalletProvider';
import { useToast } from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, Input } from '@chakra-ui/react';
import { detectSwap, buyTokens, sellTokens, getUniswapContract, getPairAddress } from '../utils/contractFunctions';
import { GET_ALL_TOKENS, GET_TOKEN, GRAPHQL_URL } from '../utils/constants';
import addresses from "../contracts/address.json";
import { addContracts, getMainWalletData } from '../utils/api';
const { weth } = addresses;

export default function Contracts() {
  const { account, balance, isConnected, web3, connect, disconnect } = useContext(Wallet);
  const toast = useToast();
  const navigate = useNavigate();
  const [mainWalletData, setMainWalletData] = useState(null);
  const [tokenData, setTokenData] = useState([]);
  const [selectedToken, setSelectedToken] = useState("");
  const [selectedTokenData, setSelectedTokenData] = useState(null);
  const [pairData, setPairData] = useState([]);
  const [sortOption, setSortOption] = useState("Address");
  const [subwallet, setSubwallet] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

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

  const onSelect = async (address) => {
    setSelectedToken(address);
    const data = await getMainWalletData(account);
    setMainWalletData(data);
    setSubwallet(data?.subwallets[0].public_key);
    onOpen();
  }

  const sortByAddress = (isReverse, tokens) => {
    tokens.sort((a, b) => {
      const aa = a.id.toLowerCase();
      const bb = b.id.toLowerCase();
      if (aa < bb) return -1;
      if (aa > bb) return 1;
      return 0;
    });
    if (isReverse) tokens = tokens.reverse();
    return tokens;
  }

  const sortByName = (isReverse, tokens) => {
    tokens.sort((a, b) => {
      const aa = a.name.toLowerCase();
      const bb = b.name.toLowerCase();
      if (aa < bb) return -1;
      if (aa > bb) return 1;
      return 0;
    });
    if (isReverse) tokens = tokens.reverse();
    return tokens;
  }

  const sortBySymbol = (isReverse, tokens) => {
    tokens.sort((a, b) => {
      const aa = a.symbol.toLowerCase();
      const bb = b.symbol.toLowerCase();
      if (aa < bb) return -1;
      if (aa > bb) return 1;
      return 0;
    });
    if (isReverse) tokens = tokens.reverse();
    return tokens;
  }

  const sortByLiquidity = (isReverse, tokens) => {
    tokens.sort((a, b) => {
      const aa = a.totalLiquidity;
      const bb = b.totalLiquidity;
      return aa - bb;
    });
    if (isReverse) tokens = tokens.reverse();
    return tokens;
  }

  const sortByMCap = (isReverse, tokens) => {
    tokens.sort((a, b) => {
      const aa = a.mcap;
      const bb = b.mcap;
      return aa - bb;
    });
    if (isReverse) tokens = tokens.reverse();
    return tokens;
  }

  const sortByPrice = (isReverse, tokens) => {
    tokens.sort((a, b) => {
      const aa = a.tokenDayData[1]?.priceUSD;
      const bb = b.tokenDayData[1]?.priceUSD;
      return aa - bb;
    });
    if (isReverse) tokens = tokens.reverse();
    return tokens;
  }

  const sortByVolume = (isReverse, tokens) => {
    tokens.sort((a, b) => {
      const aa = a.tradeVolumeUSD;
      const bb = b.tradeVolumeUSD;
      return aa - bb;
    });
    if (isReverse) tokens = tokens.reverse();
    return tokens;
  }

  useEffect(() => {
    let email = sessionStorage.getItem("email");
    if (!email) window.location.href = "/login";
  }, [])

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
        // setTokenData(characters.data.tokens);
        let tokenData = [];
        for (let i = 0; i < characters.data.tokens.length; i++) {
          if (!characters.data.tokens[i].tokenDayData[1]?.priceUSD) continue;
          if (!characters.data.tokens[i].tokenDayData[1]) continue;
          // console.log(characters.data.tokens[i].id);
          const pairAddress = await getPairAddress(characters.data.tokens[i].id);
          const mcap = characters.data.tokens[i].totalSupply * characters.data.tokens[i].tokenDayData[1]?.priceUSD;
          // console.log(tokenData);
          tokenData = [...tokenData, { ...characters.data.tokens[i], pair: pairAddress, mcap: mcap }];
          setTokenData(tokenData);
        }
      } catch (err) {
        console.log(err);
      }
    }
    getTokenData();
  }, [])

  useEffect(() => {
    // if (!tokenData) return;
    switch (sortOption) {
      case "Address": {
        setTokenData(tokenData => [...sortByAddress(false, tokenData)]);
        break;
      }
      case "Address(reverse)": {
        setTokenData(tokenData => [...sortByAddress(true, tokenData)]);
        break;
      }
      case "Name": {
        setTokenData(tokenData => [...sortByName(false, tokenData)]);
        break;
      }
      case "Name(reverse)": {
        setTokenData(tokenData => [...sortByName(true, tokenData)]);
        break;
      }
      case "Symbol": {
        setTokenData(tokenData => [...sortBySymbol(false, tokenData)]);
        break;
      }
      case "Symbol(reverse)": {
        setTokenData(tokenData => [...sortBySymbol(true, tokenData)]);
        break;
      }
      case "Liquidity": {
        setTokenData(tokenData => [...sortByLiquidity(false, tokenData)]);
        break;
      }
      case "Liquidity(reverse)": {
        setTokenData(tokenData => [...sortByLiquidity(true, tokenData)]);
        break;
      }
      case "MCap": {
        setTokenData(tokenData => [...sortByMCap(false, tokenData)]);
        break;
      }
      case "MCap(reverse)": {
        setTokenData(tokenData => [...sortByMCap(true, tokenData)]);
        break;
      }
      case "Price": {
        setTokenData(tokenData => [...sortByPrice(false, tokenData)]);
        break;
      }
      case "Price(reverse)": {
        setTokenData(tokenData => [...sortByPrice(true, tokenData)]);
        break;
      }
      case "24h Volume": {
        setTokenData(tokenData => [...sortByVolume(false, tokenData)]);
        break;
      }
      case "24h Volume(reverse)": {
        setTokenData(tokenData => [...sortByVolume(true, tokenData)]);
        break;
      }
    }
  }, [sortOption])

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
            <option value="Address(reverse)">Address(reverse)</option>
            <option value="Name">Name</option>
            <option value="Name(reverse)">Name(reverse)</option>
            <option value="Symbol">Symbol</option>
            <option value="Symbol(reverse)">Symbol(reverse)</option>
            <option value="Liquidity">Liquidity</option>
            <option value="Liquidity(reverse)">Liquidity(reverse)</option>
            <option value="MCap">MCap</option>
            <option value="MCap(reverse)">MCap(reverse)</option>
            <option value="Price">Price</option>
            <option value="Price(reverse)">Price(reverse)</option>
            <option value="24h Volume">24h Volume</option>
            <option value="24h Volume(reverse)">24h Volume(reverse)</option>
          </select>
          <div className="title">
            Filter
          </div>
          <select onChange={e => setSortOption(e.target.value)}>
            {/* <option value="Address">Address</option>
            <option value="Address(reverse)">Address(reverse)</option>
            <option value="Name">Name</option>
            <option value="Name(reverse)">Name(reverse)</option>
            <option value="Symbol">Symbol</option>
            <option value="Symbol(reverse)">Symbol(reverse)</option>
            <option value="Liquidity">Liquidity</option>
            <option value="Liquidity(reverse)">Liquidity(reverse)</option>
            <option value="MCap">MCap</option>
            <option value="MCap(reverse)">MCap(reverse)</option>
            <option value="Price">Price</option>
            <option value="Price(reverse)">Price(reverse)</option>
            <option value="24h Volume">24h Volume</option>
            <option value="24h Volume(reverse)">24h Volume(reverse)</option> */}
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
          <div className="header">24h Volume</div>
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
                <div className="element">{item.mcap}</div>
                <div className="element">{item.tokenDayData[1]?.priceUSD}</div>
                <div className="element">{item.tradeVolumeUSD}</div>
                <div className="element">0% / 0%</div>
                <div className="element">
                  <button onClick={() => { onSelect(item.id) }}>Select</button>
                </div>
              </>
            ))
          }
        </div>
        {!tokenData.length && <div className="loading">Loading...</div>}
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
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        width="500px"
      >
        <ModalOverlay />
        <ModalContent className="account-modal">
          <ModalHeader>Select subwallet to use</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <select onChange={e => setSubwallet(e.target.value)}>
              {
                mainWalletData?.subwallets?.map((item, index) => (
                  <option key={index} value={item.public_key}>{item.public_key}</option>
                ))
              }
            </select>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={() => {
              console.log(subwallet, selectedToken);
              addContracts(subwallet, [selectedToken]);
              onClose();
            }}>
              OK
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
