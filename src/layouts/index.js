import React from 'react';
import Header from "./Header";
import Sidebar from "./Sidebar";


export default function Layout({ children }) {
  if (window.location.pathname === "/logup") return (
    <div className="log-layout">
      {children}
    </div>
  )
  if (window.location.pathname === "/login") return (
    <div className="log-layout">
      {children}
    </div>
  )
  return (
    <>
      <Header />
      <Sidebar />
      <div className="page-content">
        {children}
      </div>
    </>
  )
}
