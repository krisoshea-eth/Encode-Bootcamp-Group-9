'use client'
import { ConnectKitButton } from "connectkit";
import "./navbar.css";
import { useEffect } from 'react'
import { useState } from 'react';
import { ethers } from 'ethers'
import { ChakraProvider, Button, Flex, Heading} from '@chakra-ui/react'

const APIKEY = process.env.NEXT_PUBLIC_GC_API_KEY
const SCORERID = process.env.NEXT_PUBLIC_GC_SCORER_ID
 
// endpoint for submitting passport
const SUBMIT_PASSPORT_URI = 'https://api.scorer.gitcoin.co/registry/submit-passport'
// endpoint for getting the signing message
const SIGNING_MESSAGE_URI = 'https://api.scorer.gitcoin.co/registry/signing-message'
// score needed to see hidden message
const thresholdNumber = 20
const headers = APIKEY ? ({
  'Content-Type': 'application/json',
  'X-API-Key': APIKEY
}) : undefined
 
declare global {
  interface Window {
    ethereum?: any
  }
}


export default function Navbar() {
  const [address, setAddress] = useState<string>('')
  const [score, setScore] = useState<string>('')

  async function connect() {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setAddress(accounts[0])
    } catch (err) {
      console.log('error connecting...')
    }
  }


  async function getSigningMessage() {
    try {
        // fetch the message to sign from the server
        const response = await fetch(SIGNING_MESSAGE_URI, {
        headers
        })
        // convert the response data to a json object
        const json = await response.json()
        return json
    } catch (err) {
        console.log('error: ', err)
    }
    }
     
    async function submitPassport() {
    try {
        // GET request to the Passport API to get the signing message and the nonce
        const { message, nonce } = await getSigningMessage()
        // instantiate a new provider instance
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // call the provider's `getSigner` API method to start the signing process
        const signer = await provider.getSigner()
        // ask the user to sign the message
        const signature = await signer.signMessage(message)
        // POST request to the Passport API, sending the signing message, the signature, and the nonce
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
        // assign the response data to `data` as a json object
        const data = await response.json()
        console.log('data:', data)
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
            console.log("PASSPORT SCORE = ", roundedScore)
          } else {
            setScore('0')
          // if the user has no score, display a message letting them know to submit thier passporta
           console.log('No score available, please add Stamps to your passport and then resubmit.')
          }
        } catch (err) {
          console.log('error: ', err)
        }
    }
  
  
  return (
    <nav>
      <h1>The Fair Ballot Dapp</h1>
      <Button colorScheme='teal' variant='outline' onClick={() => {submitPassport(); connect()}}>Submit Passport</Button>
      <Button colorScheme='teal' variant='outline' onClick={getScore} >get score</Button>
      <Button colorScheme='teal' variant='outline' onClick={getScore}>{`Score: ${score}`}</Button>
      <ConnectKitButton/>
    </nav>
  );
}
