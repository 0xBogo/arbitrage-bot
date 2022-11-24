import React, { useContext } from 'react';
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
    const { account, balance, networkId, isConnected, changeNetwork, connect, disconnect } = useContext(Wallet);
    const networkIds = ["5", "80001", "97"];
    const networkLogos = [eth, polygon, bsc];
    return (
        <div id="header">
            <div className="left">
                <a className="logo" href="/">
                    <img src={logo} />
                </a>
                {/* <div className="nav-item">
                    <span>Marketplace</span>
                    <TriangleDownIcon boxSize={"12px"} />
                    <div className="page-links">
                        <Link to="/">Home</Link>
                        <Link to="/explore">Explore</Link>
                        <Link to="/nft_ranking">NFT Ranking</Link>
                    </div>
                </div>
                <div className="nav-item">
                    Events
                </div> */}
            </div>
            <div className="right">
                {/* <Link className="create-btn" to="/create">
                    Create
                </Link> */}
                <div className="connect">
                    {
                        isConnected
                            ? <>
                                <div className="address">{account.slice(0, 5)}...{account.slice(-4,)}</div>
                                <div className="network-lists"> 
                                    {
                                        networkIds.map((item, index) => 
                                            <div className="network" key={index} onClick={() => changeNetwork(networks[item].chainId)}><img src={networkLogos[index]} />{networks[item].chainName}</div>
                                        )
                                    }
                                    <Divider marginY="6px" />
                                    <button className="disconnect-btn" onClick={disconnect}>Disconnect</button>
                                </div>
                            </>
                            : <button className="connect-btn" onClick={connect}>Connect</button>
                    }
                </div>
                <Link className="user-btn" to={`/homepage/${account}`}>
                    <img src={user} />
                </Link>
            </div>
        </div>
    )
}
