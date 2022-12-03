import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@chakra-ui/react";
import logo from "../assets/img/logo-white.png";
import checkbox0 from "../assets/img/checkbox-0.png";
import checkbox1 from "../assets/img/checkbox-1.png";
import { addUser } from '../utils/api';

export default function Logup() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [checkFlags, setCheckFlags] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  const logup = async () => {
    if (checkFlags[0] && checkFlags[1] && checkFlags[2]) {
      try {
        const result = await addUser(email, pwd);
        if (result === "user already exists") {
          toast({
            title: 'Account exists',
            description: email,
            status: 'warning',
            duration: 2000,
            isClosable: true
          })
        } else {
          toast({
            title: 'Account created',
            description: email,
            status: 'success',
            duration: 2000,
            isClosable: true
          })
          navigate("/login");
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      toast({
        title: 'Required Fields not filled',
        description: "",
        status: 'warning',
        duration: 2000,
        isClosable: true
      })
    }
  }

  useEffect(() => {
    let flags = [];
    flags[0] = email ? true : false;
    flags[1] = pwd ? true : false;
    flags[2] = isChecked;
    setCheckFlags(flags);
  }, [email, pwd, isChecked])

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
          {/* <div className="input">
            <div className="input-title">
              Full Name*
            </div>
            <input type="text" placeholder="Enter your name" />
          </div> */}
          <div className="input">
            <div className="input-title">
              Email*
            </div>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email id" />
            {!checkFlags[0] && <div className="warning">Email is required</div>}
          </div>
          <div className="input">
            <div className="input-title">
              Password*
            </div>
            <input type="password" value={pwd} onChange={e => setPwd(e.target.value)} placeholder="Enter password" />
            {!checkFlags[1] && <div className="warning">Password is required</div>}
          </div>
          <div className="check">
            <img src={isChecked ? checkbox1 : checkbox0} onClick={() => setIsChecked(p => !p)} />
            <span>I have read and by creating my user account. I accept the general <a className="font-blue" href="">Terms & Conditions</a></span>
          </div>
          <button onClick={logup}>Create Account</button>
          <div className="already-created">
            Already have an account? <a className="font-blue" href="/login">Login now</a>
          </div>
        </div>
      </div>
    </>
  )
}
