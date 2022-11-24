import React from 'react';
import logo from "../assets/img/logo-white.png";


export default function Login() {
  return (
    <>
      <div className="left-section">
        <img src={logo} />
      </div>
      <div className="right-section">
        <div className="logup">
          <div className="title">
            Log in
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
          <button>Log in</button>
          <div className="already-created">
            Not a member? <a className="font-blue" href="/logup">Create account now</a>
          </div>
        </div>
      </div>
    </>
  )
}
