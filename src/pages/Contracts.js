import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from '../providers/WalletProvider';
import { useToast } from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, Input } from '@chakra-ui/react';
import { detectSwap, buyTokens, sellTokens, getUniswapContract, getPairAddress } from '../utils/contractFunctions';
import { GET_ALL_TOKENS, GRAPHQL_URL } from '../utils/constants';
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
  // const [selectedTokenData, setSelectedTokenData] = useState(null);
  // const [pairData, setPairData] = useState([]);
  const [sortOption, setSortOption] = useState("Address");
  const [filterOption, setFilterOption] = useState("None");
  const [max, setMax] = useState("");
  const [min, setMin] = useState("");
  const [rawTokenData, setRawTokenData] = useState([]);
  const [subwallet, setSubwallet] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

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
      const aa = a.priceUSD;
      const bb = b.priceUSD;
      return aa - bb;
    });
    if (isReverse) tokens = tokens.reverse();
    return tokens;
  }

  const sortByVolume = (isReverse, tokens) => {
    tokens.sort((a, b) => {
      const aa = a.dailyVolumeUSD;
      const bb = b.dailyVolumeUSD;
      return aa - bb;
    });
    if (isReverse) tokens = tokens.reverse();
    return tokens;
  }

  const filtByMCap = (tokens, max, min) => {
    const result = tokens.filter(token => {
      if (max === "") return token.mcap > min;
      if (min === "") return token.mcap < max;
      return token.mcap > min && token.mcap < max;
    });
    // console.log(result);
    return result;
  }

  const filtByVolume = (tokens, max, min) => {
    const result = tokens.filter(token => {
      if (max === "") return token.dailyVolumeUSD > min;
      if (min === "") return token.dailyVolumeUSD < max;
      return token.mcap > min && token.mcap < max;
    });
    return result;
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
        const characters = await results.json();
        const data = characters.data.tokens;
        let tokenData = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].tokenDayData.length === 0) continue;
          if (data[i].pairBase.length === 0) continue;
          const mcap = data[i].totalSupply * data[i].tokenDayData[0].priceUSD;
          // console.log(tokenData);
          tokenData = [...tokenData, { ...data[i], ...data[i].tokenDayData[0], mcap: mcap }];
          // console.log(tokenData);
          setRawTokenData(tokenData);
          setTokenData(tokenData);
        }
      } catch (err) {
        console.log(err);
      }
    }
    getTokenData();
  }, [])

  useEffect(() => {
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

  const runFilter = () => {
    switch (filterOption) {
      case "None": {
        setTokenData([...rawTokenData]);
        break;
      }
      case "MCap": {
        if (max === "" && min === "") {
          toast({
            title: 'Please input limits',
            description: "",
            status: 'warning',
            duration: 2000,
            isClosable: true
          })
          return;
        }
        setTokenData(tokenData => [...filtByMCap(tokenData, max, min)]);
        break;
      }
      case "Volume": {
        if (max === "" && min === "") {
          toast({
            title: 'Please input limits',
            description: "",
            status: 'warning',
            duration: 2000,
            isClosable: true
          })
          return;
        }
        setTokenData(tokenData => [...filtByVolume(tokenData, max, min)]);
        break;
      }
    }
  }

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
            Filter by
          </div>
          <select onChange={e => setFilterOption(e.target.value)}>
            <option value="None">None</option>
            <option value="MCap">MCap</option>
            <option value="Volume">Volume</option>
          </select>
        </div>
        {
          filterOption !== "None" &&
          <div className="filter">
            <div className="title">Max</div>
            <input value={max} onChange={e => setMax(e.target.value)} />
            <div className="title">Min</div>
            <input value={min} onChange={e => setMin(e.target.value)} />
            <button onClick={runFilter}>Filter</button>
          </div>
        }
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
                <a className="element" href={`https://dexscreener.com/ethereum/${item.pairBase[0].id}`} target="_blank">WETH/{item.symbol}</a>
                <div className="element">{item.totalLiquidity}</div>
                <div className="element">{item.mcap}</div>
                <div className="element">{item.priceUSD}</div>
                <div className="element">{item.dailyVolumeUSD}</div>
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
