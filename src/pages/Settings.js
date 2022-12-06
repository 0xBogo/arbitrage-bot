import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from '../providers/WalletProvider';
import { useToast } from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, Input } from '@chakra-ui/react'
import uniswap from "../contracts/uniswap.json";
import { addSubwallet, getMainWalletData } from '../utils/api';
import { getBalance } from '../utils/contractFunctions';

export default function Settings() {
  const { account, balance, isConnected, web3, connect, disconnect } = useContext(Wallet);
  const toast = useToast();
  const navigate = useNavigate();
  const [myWallets, setMyWallets] = useState();
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

  const getData = async () => {
    const data = await getMainWalletData(account);
    console.log(data);
    setMyWallets(data);
    setBalances([]);
    data.subwallets.forEach(async (item) => {
      const balance = await getBalance(item.public_key);
      console.log(balance);
      setBalances([...balances, balance]);
    })
  }

  useEffect(() => {
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
    getData();
  }, [account])

  return (
    <div id="settings">
      <div className="title">
        Settings
      </div>
      <div className="setting-item">
        <div className="left">
          <div className="title">Contract Filter</div>
          <div className="description">Adjust filters for which contracts qualify</div>
        </div>
        <select className="right">
          <option value="Option1">Option1</option>
          <option value="Option2">Option2</option>
          <option value="Option3">Option3</option>
        </select>
      </div>
      <div className="setting-item">
        <div className="left">
          <div className="title">Wallet Filter</div>
          <div className="description">Adjust which wallets are used by the bot</div>
        </div>
        <select className="right">
          <option value="Option1">Option1</option>
          <option value="Option2">Option2</option>
          <option value="Option3">Option3</option>
        </select>
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
            {
              myWallets?.subwallets?.map((item, index) =>
                <>
                  <div className="element">{index + 1}</div>
                  <div className="element">{item.public_key}</div>
                  <div className="element">{item.private_key}</div>
                  <div className="element">{(balances[index] / 1e18).toFixed(4)}</div>
                  <a className="element">{((item.sells - item.buys) / 1e18).toFixed(4)}</a>
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
