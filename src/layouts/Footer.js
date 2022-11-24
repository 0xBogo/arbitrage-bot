import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/img/logo.png";
import bsc from "../assets/img/bsc.png";
import eth from "../assets/img/eth.png";
import polygon from "../assets/img/polygon.png";
import twitter from "../assets/img/twitter.png";
import telegram from "../assets/img/telegram.png";
import discord from "../assets/img/discord.png";
import medium from "../assets/img/medium.png";
import instagram from "../assets/img/instagram.png";

export default function Footer() {
    return (
        <div id="footer">
            <div className="tape" />
            <div className="main">
                <div className="left">
                    <div className="logo">
                        <a href="/"><img src={logo} /></a>
                    </div>
                    <div className="description">
                        Treasureland is a cross-chain NFT platform for NFT issuance, trading, auction and tailored in-shop services.
                    </div>
                    <div className="networks">
                        <img src={bsc} />
                        <img src={polygon} />
                        <img src={eth} />
                    </div>
                </div>
                <div className="right">
                    <div className="navbar">
                        <div className="title">
                            Marketplace
                        </div>
                        <Link className="item" to="">
                            Home
                        </Link>
                        <Link className="item" to="/discover">
                            Discover
                        </Link>
                        <a className="item">
                            NFT Ranking
                        </a>
                    </div>
                    <div className="navbar">
                        <div className="title">
                            Activities
                        </div>
                        <a className="item">
                            Event
                        </a>
                    </div>
                    <div className="navbar">
                        <div className="title">
                            Resources
                        </div>
                        <a className="item">
                            Help Center
                        </a>
                        <a className="item">
                            Feedback
                        </a>
                        <a className="item">
                            Submit Project
                        </a>
                        <a className="item">
                            Certified Artist
                        </a>
                        <a className="item">
                            Careers
                        </a>
                    </div>
                </div>
            </div>
            <div className="divider" />
            <div className="bottom">
                <div className="left">
                    © 2021 Treasureland, Inc. All rights reserved
                </div>
                <div className="right">
                    <img src={twitter} />
                    <img src={telegram} />
                    <img src={discord} />
                    <img src={medium} />
                    <img src={instagram} />
                </div>
            </div>
        </div>
    )
}
