import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from '../providers/WalletProvider';
import { useToast } from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, Input } from '@chakra-ui/react'
import uniswap from "../contracts/uniswap.json";
import { addSubwallet, deleteSubwallet, getMainWalletData } from '../utils/api';
import { getBalance } from '../utils/contractFunctions';

export default function Settings() {
  const { account, balance, isConnected, web3, connect, disconnect } = useContext(Wallet);
  const toast = useToast();
  const navigate = useNavigate();
  const [ethAmount, setEthAmount] = useState("0.05");
  const [ethLimit, setEthLimit] = useState("1");
  const [myWallets, setMyWallets] = useState([]);
  const [balances, setBalances] = useState([]);
  const [privateKey, setPrivateKey] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const addWallet = async () => {
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
    try {
      const wallet = web3.eth.accounts.privateKeyToAccount(privateKey);
      addSubwallet(account, wallet.address, privateKey);
      getData();
    } catch (err) {
      console.log(err);
    }
  }

  const deleteWallet = async (address) => {
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
    try {
      deleteSubwallet(address);
      getData();
    } catch (err) {
      console.log(err);
    }
  }

  const getData = async () => {
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
    setMyWallets([]);
    const data = await getMainWalletData(account);
    // console.log(data);
    for (let i = 0; i < data.subwallets.length; i++) {
      const balance = await getBalance(data.subwallets[i].public_key);
      console.log(balance);
      setMyWallets(myWallets => [...myWallets, { ...data.subwallets[i], balance: balance }]);
    }
  }

  const saveEthAmount = () => {
    sessionStorage.setItem("ethAmount", ethAmount);
    toast({
      title: 'save success',
      description: "",
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }

  const saveEthLimit = () => {
    sessionStorage.setItem("ethLimit", ethLimit);
    toast({
      title: 'save success',
      description: "",
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }

  useEffect(() => {
    let email = sessionStorage.getItem("email");
    if (!email) window.location.href = "/login";
  }, [])

  useEffect(() => {
    let ethAmount = sessionStorage.getItem("ethAmount");
    let ethLimit = sessionStorage.getItem("ethLimit");
    if (ethAmount) setEthAmount(ethAmount);
    if (ethLimit) setEthLimit(ethLimit);
  }, [])

  useEffect(() => {
    getData();
  }, [account])

  return (
    <div id="settings">
      <div className="title">
        Settings
      </div>
      <div className="setting-item">
        <div className="left">
          <div className="title">ETH per Bot</div>
          <div className="description">Adjust ETH amount for each bot</div>
        </div>
        <div className="right">
          <input type="number" value={ethAmount} onChange={e => setEthAmount(e.target.value)} />
          <button className="default-btn" onClick={saveEthAmount}>Save</button>
        </div>
      </div>
      <div className="setting-item">
        <div className="left">
          <div className="title">ETH Limit</div>
          <div className="description">Adjust ETH limit for eth subwallet</div>
        </div>
        <div className="right">
          <input type="number" value={ethLimit} onChange={e => setEthLimit(e.target.value)} />
          <button className="default-btn" onClick={saveEthLimit}>Save</button>
        </div>
      </div>
      <div className="wallets">
        <div className="title">
          My Wallets
        </div>
        <div className="my-wallet-section">
          <div className="wallets-list">
            <div className="header">ID</div>
            <div className="header">Public Key</div>
            <div className="header">Private Key</div>
            <div className="header">Balance</div>
            <div className="header">Profit</div>
            <div className="header">Action</div>
            {
              myWallets?.map((item, index) =>
                <>
                  <div className="element">{index + 1}</div>
                  <div className="element">{item.public_key}</div>
                  <div className="element">{item.private_key}</div>
                  <div className="element">{(item.balance / 1e18).toFixed(4)}</div>
                  <a className="element">{((item.sells - item.buys) / 1e18).toFixed(4)}</a>
                  <div className="element">
                    <button onClick={() => deleteWallet(item.public_key)}>Delete</button>
                  </div>
                </>
              )
            }
          </div>
          <div className="btn-container">
            <button className="add-btn" onClick={onOpen}>+ Add</button>
          </div>
        </div>
      </div>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent className="account-modal">
          <ModalHeader>Input your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Input
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              placeholder='Private Key'
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={async () => {
              await addWallet(privateKey);
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
