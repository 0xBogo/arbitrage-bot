import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from '../providers/WalletProvider';
import { useToast } from "@chakra-ui/react";
import uniswap from "../contracts/uniswap.json";

export default function Contracts() {
  const { account, balance, networkId, isConnected, changeNetwork, connect, disconnect } = useContext(Wallet);
  const toast = useToast();
  const navigate = useNavigate();

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

          <div className="element">Contract_1</div>
          <div className="element">Symbol_1</div>
          <a className="element">Address_1</a>
          <a className="element">Chart Link_1</a>
          <div className="element">
            <button>Select</button>
          </div>

          <div className="element">Contract_2</div>
          <div className="element">Symbol_2</div>
          <a className="element">Address_2</a>
          <a className="element">Chart Link_2</a>
          <div className="element">
            <button>Select</button>
          </div>

          <div className="element">Contract_3</div>
          <div className="element">Symbol_3</div>
          <a className="element">Address_3</a>
          <a className="element">Chart Link_3</a>
          <div className="element">
            <button>Select</button>
          </div>

          <div className="element">Contract_4</div>
          <div className="element">Symbol_4</div>
          <a className="element">Address_4</a>
          <a className="element">Chart Link_4</a>
          <div className="element">
            <button>Select</button>
          </div>

        </div>
      </div>
      <div className="contract-details-section">
        <div className="title">
          Contract Details
        </div>
        <div className="basic">
          <div className="detail-item">
            <div className="title">Contract Name</div>
            <div className="value">Contract_1</div>
          </div>
          <div className="detail-item">
            <div className="title">Contract Symbol</div>
            <div className="value">Symbol_1</div>
          </div>
          <div className="detail-item">
            <div className="title">Contract Address</div>
            <div className="value">Address_1</div>
          </div>
          <div className="detail-item">
            <div className="title">Contract Chart Link</div>
            <div className="value">Chart Link_1</div>
          </div>
          <div className="detail-item">
            <div className="title">Contract Liquidity</div>
            <div className="value">Liquidity_1</div>
          </div>
          <div className="detail-item">
            <div className="title">Contract MCap</div>
            <div className="value">MCap_1</div>
          </div>
          <div className="detail-item">
            <div className="title">Contract Price</div>
            <div className="value">Price_1</div>
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
