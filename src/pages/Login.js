import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@chakra-ui/react";
import logo from "../assets/img/logo-white.png";
import { verifyUser } from '../utils/api';


export default function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [checkFlags, setCheckFlags] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  const login = async () => {
    try {
      const state = await verifyUser(email, pwd);
      switch (state) {
        case 0: {
          toast({
            title: 'Account not exists',
            description: "",
            status: 'warning',
            duration: 2000,
            isClosable: true
          })
          break;
        }
        case 1: {
          toast({
            title: 'Password not matches',
            description: "",
            status: 'warning',
            duration: 2000,
            isClosable: true
          })
          break;
        }
        case 2: {
          sessionStorage.setItem("email", email);
          window.location.href = "/";
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  
  useEffect(() => {
    let email = sessionStorage.getItem("email");
    setEmail(email);
  }, [])

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
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email id" />
          </div>
          <div className="input">
            <div className="input-title">
              Password*
            </div>
            <input type="password" value={pwd} onChange={e => setPwd(e.target.value)} placeholder="Enter password" />
          </div>
          <button onClick={login}>Log in</button>
          <div className="already-created">
            Not a member? <a className="font-blue" href="/logup">Create account now</a>
          </div>
        </div>
      </div>
    </>
  )
}
