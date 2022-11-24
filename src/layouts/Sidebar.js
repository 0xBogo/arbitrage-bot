import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import home from "../assets/img/home.svg";
import homeActive from "../assets/img/home-active.svg";
import contracts from "../assets/img/contracts.svg";
import contractsActive from "../assets/img/contracts-active.svg";
import settings from "../assets/img/settings.svg";
import settingsActive from "../assets/img/settings-active.svg";

function Sidebar() {

    const navigate = useNavigate();

    return (
        <div id="sidebar">
            <div className="tab-container">
                <div className={window.location.pathname === "/" ? "tab-active" : "tab"} onClick={() => navigate("/")}>
                    <img src={window.location.pathname === "/" ? homeActive : home} />
                    Dashboard
                </div>
                <div className={window.location.pathname === "/contracts" ? "tab-active" : "tab"} onClick={() => navigate("/contracts")}>
                    <img src={window.location.pathname === "/contracts" ? contractsActive : contracts} />
                    Contracts
                </div>
                <div className={window.location.pathname === "/stats" ? "tab-active" : "tab"} onClick={() => navigate("/stats")}>
                    <img src={window.location.pathname === "/stats" ? homeActive : home} />
                    Stats
                </div>
                <div className={window.location.pathname === "/settings" ? "tab-active" : "tab"} onClick={() => navigate("/settings")}>
                    <img src={window.location.pathname === "/settings" ? settingsActive : settings} />
                    Settings
                </div>
            </div>
        </div>
    )
}

export default Sidebar;