import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react'
import './assets/style/styles.scss';
import Layout from './layouts';
import Dashboard from './pages/Dashboard';
import Contracts from './pages/Contracts';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import Logup from './pages/Logup';
import Login from './pages/Login';

function App() {

  return (
    <ChakraProvider>
      <Layout>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/logup" element={<Logup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
    </ChakraProvider>
  );
}

export default App;
