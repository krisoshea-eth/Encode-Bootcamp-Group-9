'use client'
import InstructionsComponent from "@/components/instructionsComponent";
import styles from "./page.module.css";
import "./globals.css";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ChakraProvider, Button, Flex, Heading } from "@chakra-ui/react";

const APIKEY: string | undefined = process.env.NEXT_PUBLIC_GC_API_KEY;
const SCORERID: string | undefined = process.env.NEXT_PUBLIC_GC_SCORER_ID;
const SUBMIT_PASSPORT_URI: string = 'https://api.scorer.gitcoin.co/registry/submit-passport';
const SIGNING_MESSAGE_URI: string = 'https://api.scorer.gitcoin.co/registry/signing-message';
const thresholdNumber: number = 20;
const provider = new ethers.providers.JsonRpcProvider();

const headers = APIKEY ? {
  'Content-Type': 'application/json',
  'X-API-Key': APIKEY,
} : undefined;

const mainStyle = {
  width: '900px',
  margin: '0 auto',
  paddingTop: 90,
};

const Passport: React.FC = () => {
  const [address, setAddress] = useState<string>('');
  const [score, setScore] = useState<string>('');
  const [isAboveThreshold, setIsAboveThreshold] = useState<boolean>(false);

  useEffect(() => {
    const checkConnection = async () => {
      const accounts = await provider.listAccounts();
      if (accounts[0]) setAddress(accounts[0]);
    };
    checkConnection();
  }, []);

  async function connect() {
    try {
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      setAddress(accounts[0]);
    } catch (err) {
      console.log('error connecting...')
    }
  }

  async function getSigningMessage() {
    try {
      const response = await fetch(SIGNING_MESSAGE_URI, {
        headers
      })
      const json = await response.json()
      return json
    } catch (err) {
      console.log('error: ', err)
    }
  }

  async function submitPassport() {
    try {
      // call the API to get the signing message and the nonce
      const { message, nonce } = await getSigningMessage()
      const signer = await provider.getSigner()
      // ask the user to sign the message
      const signature = await signer.signMessage(message)
      // call the API, sending the signing message, the signature, and the nonce
      const response = await fetch(SUBMIT_PASSPORT_URI, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          address,
          scorer_id: SCORERID,
          signature,
          nonce
        })
      })

      const data = await response.json()
      console.log('data:', data)
      getScore()
    } catch (err) {
      console.log('error: ', err)
    }
  }

  async function getScore() {
    setScore('')
    const GET_PASSPORT_SCORE_URI = `https://api.scorer.gitcoin.co/registry/score/${SCORERID}/${address}`
    try {
      const response = await fetch(GET_PASSPORT_SCORE_URI, {
        headers
      })
      const passportData = await response.json()
      if (passportData.score) {
        // if the user has a score, round it and set it in the local state
        const roundedScore = Math.round(passportData.score * 100) / 100
        setScore(roundedScore.toString())
        if (roundedScore > thresholdNumber) {
          setIsAboveThreshold(true)
        } else {
          setIsAboveThreshold(false)
        }
        console.log("PASSPORT SCORE = ", roundedScore)
      } else {
        // if the user has no score, display a message letting them know to submit thier passporta
        console.log('No score available, please add stamps to your passport and then resubmit.')
      }
    } catch (err) {
      console.log('error: ', err)
    }
  }

  const mainStyle = {
    width: '900px',
    margin: '0 auto',
    paddingTop: 90,
  };

  return (
    <div style={mainStyle}>
      <ChakraProvider>
        <Flex minWidth='max-content' alignItems='right' gap='2' justifyContent='right'>
          <Button colorScheme='teal' variant='outline' onClick={connect}>Connect Wallet</Button>
          <Button colorScheme='teal' variant='outline' onClick={submitPassport}>Connect Passport</Button>
        </Flex>
        <br />
        <Heading as='h1' size='4xl' noOfLines={2}>Welcome to the decentralized web</Heading>
        <br />
      </ChakraProvider>
    </div>
  );
}

export default Passport;

export const Home: React.FC = () => (
  <main className={styles.main}>
    {<InstructionsComponent></InstructionsComponent>}
  </main>
);

