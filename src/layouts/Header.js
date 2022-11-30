import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Wallet } from '../providers/WalletProvider';
import { TriangleDownIcon } from "@chakra-ui/icons";
import { Divider } from '@chakra-ui/react';
import networks from "../providers/networks.json";
import logo from "../assets/img/logo.png";
import bsc from "../assets/img/bsc.png";
import eth from "../assets/img/eth.png";
import polygon from "../assets/img/polygon.png";
import user from "../assets/img/user.svg";

export default function Header() {
    const { account, balance, isConnected, connect, disconnect } = useContext(Wallet);

    return (
        <div id="header">
            <div className="left">
                <a className="logo" href="/">
                    {/* <img src={logo} /> */}
                </a>
            </div>
            <div className="right">
                {/* <Link className="create-btn" to="/settings">
                    + Add Subwallet
                </Link> */}
                <div className="connect">
                    {
                        isConnected
                            ? <>
                                <div className="address">{account?.slice(0, 5)}...{account?.slice(-4,)}</div>
                                <div className="network-lists">
                                    <div className="network">
                                        <img src={eth} />{(balance / 1e18).toFixed(4)} ETH
                                    </div>
                                    <Divider marginY="6px" />
                                    <button className="disconnect-btn" onClick={disconnect}>Disconnect</button>
                                </div>
                            </>
                            : <button className="connect-btn" onClick={connect}>Connect</button>
                    }
                </div>
                <Link className="user-btn" to="/settings">
                    <img src={user} />
                </Link>
            </div>
        </div>
    )
}
