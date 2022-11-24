import React, { useState } from 'react';
import logo from "../assets/img/logo-white.png";
import checkbox0 from "../assets/img/checkbox-0.png";
import checkbox1 from "../assets/img/checkbox-1.png";

export default function Logup() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <>
      <div className="left-section">
        <img src={logo} />
      </div>
      <div className="right-section">
        <div className="logup">
          <div className="title">
            Create Account
          </div>
          <div className="input">
            <div className="input-title">
              Full Name*
            </div>
            <input type="text" placeholder="Enter your name" />
          </div>
          <div className="input">
            <div className="input-title">
              Email*
            </div>
            <input type="email" placeholder="Enter email id" />
          </div>
          <div className="input">
            <div className="input-title">
              Password*
            </div>
            <input type="password" placeholder="Enter password" />
          </div>
          <div className="check">
            <img src={isChecked? checkbox1: checkbox0} onClick={() => setIsChecked(p => !p)} />
            <span>I have read and by creating my user account. I accept the general <a className="font-blue" href="">Terms & Conditions</a></span>
          </div>
          <button>Create Account</button>
          <div className="already-created">
            Already have an account? <a className="font-blue" href="/login">Login now</a>
          </div>
        </div>
      </div>
    </>
  )
}
