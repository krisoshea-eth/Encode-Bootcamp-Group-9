'use client'
// Common imports and constants
import React, { FC, ReactNode, useState, useEffect } from "react";
import Navbar from "@/components/instructionsComponent/navigation/navbar";
import Footer from "@/components/instructionsComponent/navigation/footer";
import { WagmiConfig, createConfig, sepolia } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { ethers } from 'ethers';

const APIKEY = process.env.NEXT_PUBLIC_GC_API_KEY;
const SCORERID = process.env.NEXT_PUBLIC_GC_SCORER_ID;
const SUBMIT_PASSPORT_URI = 'https://api.scorer.gitcoin.co/registry/submit-passport';
const SIGNING_MESSAGE_URI = 'https://api.scorer.gitcoin.co/registry/signing-message';
const provider = new ethers.providers.JsonRpcProvider();

const headers = APIKEY ? {
  'Content-Type': 'application/json',
  'X-API-Key': APIKEY,
} : undefined;

const config = createConfig(
  getDefaultConfig({
    infuraId: process.env.INFURA_API_KEY,
    walletConnectProjectId: "demo",
    chains: [sepolia],
    appName: "You Create Web3 Dapp",
    appDescription: "Your App Description",
    appUrl: "https://family.co",
    appIcon: "https://family.co/logo.png",
  })
);

// Layout component
const Layout: FC<{ children: ReactNode }> = ({ children }) => (
  <WagmiConfig config={config}>
    <ConnectKitProvider mode="dark">
      <div style={{ display: "flex", flexDirection: "column", minHeight: "105vh" }}>
        <Navbar />
        <div>{children}</div>
        <Footer />
      </div>
    </ConnectKitProvider>
  </WagmiConfig>
);

// Passport component
export const Passport: FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string>(''); // Typed useState

  useEffect(() => {
    const checkConnection = async () => {
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress(); // This should return a string
      setAddress(signerAddress); // No error, as signerAddress is a string
    };
    checkConnection();
  }, []);

  const connect = async () => {
    try {
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      setAddress(accounts[0]);
    } catch (err) {
      console.log('Error connecting...');
    }
  };

  const getSigningMessage = async () => {
    try {
      const response = await fetch(SIGNING_MESSAGE_URI, { headers });
      return await response.json();
    } catch (err) {
      console.log('Error:', err);
    }
  };

  const submitPassport = async () => {
    try {
      const { message, nonce } = await getSigningMessage();
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);

      const response = await fetch(SUBMIT_PASSPORT_URI, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          address,
          scorer_id: SCORERID,
          signature,
          nonce,
        }),
      });

      const data = await response.json();
      console.log('Data:', data);
    } catch (err) {
      console.log('Error:', err);
    }
  };


  const styles = {
    main: {
      width: '900px',
      margin: '0 auto',
      paddingTop: 90
    },
    heading: {
      fontSize: 60
    },
    intro: {
      fontSize: 18,
      color: 'rgba(0, 0, 0, .55)'
    },
    configurePassport: {
      marginTop: 20,
    },
    linkStyle: {
      color: '#008aff'
    },
    buttonContainer: {
      marginTop: 20
    },
    buttonStyle: {
      padding: '10px 30px',
      outline: 'none',
      border: 'none',
      cursor: 'pointer',
      marginRight: '10px',
      borderBottom: '2px solid rgba(0, 0, 0, .2)',
      borderRight: '2px solid rgba(0, 0, 0, .2)'
    },
    hiddenMessageContainer: {
      marginTop: 15
    },
    noScoreMessage: {
      marginTop: 20
    }
  }

  return (
    <WagmiConfig config={createConfig(getDefaultConfig({
      infuraId: process.env.INFURA_API_KEY,
      walletConnectProjectId: "demo",
      chains: [sepolia],
      appName: "You Create Web3 Dapp",
    }))}>
      <ConnectKitProvider mode="dark">
        <div style={{ display: "flex", flexDirection: "column", minHeight: "105vh" }}>
          <Navbar />
          <div style={{ flexGrow: 1 }}>{children}</div>
          <Footer />
        </div>
        {/* Your other UI components */}
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default Layout;
