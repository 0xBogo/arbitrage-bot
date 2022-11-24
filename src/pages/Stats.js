import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from '../providers/WalletProvider';
import { useToast } from "@chakra-ui/react";
import uniswap from "../contracts/uniswap.json";

export default function Stats() {
  const { account, balance, networkId, isConnected, changeNetwork, connect, disconnect } = useContext(Wallet);
  const toast = useToast();
  const navigate = useNavigate();

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
            <div className="value">0000</div>
          </div>
          <div className="detail-item">
            <div className="title">Total Sells</div>
            <div className="value">0000</div>
          </div>
          <div className="detail-item">
            <div className="title">Total Profit Generated</div>
            <div className="value">0000</div>
          </div>
          <div className="detail-item">
            <div className="title">Total Contracts Available to use by Bot</div>
            <div className="value">00</div>
          </div>
          <div className="detail-item">
            <div className="title">Total Contract Currently Selected by Bot (in use)</div>
            <div className="value">00</div>
          </div>
          <div className="detail-item">
            <div className="title">Total Gas Spent</div>
            <div className="value">0000</div>
          </div>
        </div>
      </div>
      
      <div className="wallet-stats-section">
        <div className="title">Wallet Stats</div>
        <div className="container">
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
          <div className="stat-list">
            <div className="header">Buy</div>
            <div className="header">Sell</div>
            <div className="header">Profit</div>
            <div className="header">Contract Wallet</div>
            <div className="header">Total Gas Spent</div>

            <div className="element">1.234</div>
            <div className="element">1.345</div>
            <a className="element">0.111</a>
            <a className="element">Wallet_1</a>
            <div className="element">0.0012</div>

            <div className="element">1.234</div>
            <div className="element">1.345</div>
            <a className="element">0.111</a>
            <a className="element">Wallet_1</a>
            <div className="element">0.0012</div>

            <div className="element">1.234</div>
            <div className="element">1.345</div>
            <a className="element">0.111</a>
            <a className="element">Wallet_1</a>
            <div className="element">0.0012</div>

            <div className="element">1.234</div>
            <div className="element">1.345</div>
            <a className="element">0.111</a>
            <a className="element">Wallet_1</a>
            <div className="element">0.0012</div>

          </div>
        </div>
      </div>

      <div className="contract-stats-section">
        <div className="title">Contract Stats</div>
        <div className="container">
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
          <div className="stat-list">
            <div className="header">Buy</div>
            <div className="header">Sell</div>
            <div className="header">Profit Generated</div>
            <div className="header">Total Gas Spent</div>

            <div className="element">1.234</div>
            <div className="element">1.345</div>
            <a className="element">0.111</a>
            <div className="element">0.0012</div>

            <div className="element">1.234</div>
            <div className="element">1.345</div>
            <a className="element">0.111</a>
            <div className="element">0.0012</div>

            <div className="element">1.234</div>
            <div className="element">1.345</div>
            <a className="element">0.111</a>
            <div className="element">0.0012</div>

            <div className="element">1.234</div>
            <div className="element">1.345</div>
            <a className="element">0.111</a>
            <div className="element">0.0012</div>

          </div>
        </div>
      </div>

    </div>
  )
}
