import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from '../providers/WalletProvider';
import { useToast } from "@chakra-ui/react";
import uniswap from "../contracts/uniswap.json";

export default function Settings() {
  const { account, balance, networkId, isConnected, changeNetwork, connect, disconnect } = useContext(Wallet);
  const toast = useToast();
  const navigate = useNavigate();

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
    </div>
  )
}
