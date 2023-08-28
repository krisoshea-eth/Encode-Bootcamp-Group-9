import React, { useState, useEffect } from "react";

import {
  useAccount,
  useNetwork,
  useBalance,
  useSignMessage,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import {
  ethers,
} from "ethers";

import * as Lottery from "../../assets/abi/Lottery.json";
import * as LotteryToken from "../../assets/abi/LotteryToken.json";

import styles from "./instructionsComponent.module.css";

const LOTTERY_CONTRACT_ADDRESS = '0x1E9F89515340353760cc673b8BaE7782414f023e';
const TOKEN_CONTRACT_ADDRESS = '0xd7A019641D691E56eaabB68dF30847D42C3f9D20';

export default function InstructionsComponent() {
  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <h1>
            Welcome to the <span>Lottery</span>
          </h1>
          <h3>Don't worry, it's fake.</h3>
        </div>
      </header>
      <div>
        <CheckState />
        <h2>Open Bets</h2>
        <OpenBets />
        <CloseLottery />
        <TokenBalance />
        <BuyTokens />
        <Bet />
      </div>
    </div>
  );
}

function CheckState() {
  const [ betsAreOpen, setBetsAreOpen ] = useState<boolean>(false);

  let { data, isError, isLoading, refetch } = useContractRead({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: Lottery.abi,
    functionName: 'betsOpen',
    onError(error) {
      console.log('betsOpen error: ', error)
    },
    onSuccess(data) {
      setBetsAreOpen(data as boolean);
    }
  });

  const onClickReadBetsOpen = () => {
    refetch();
  }

  const displayResult = (areOpen: boolean) => {
    return <span>Lottery is currently: {areOpen ? 'open' : 'closed' }</span>
  }

  return (
    <div>
      { isLoading && <span>Loading...</span>}
      { isError ? <span>Error checking if bets are open</span> : displayResult(betsAreOpen) }
      <button onClick={onClickReadBetsOpen} disabled={isLoading}>Refresh</button>
    </div>
  );
}

function OpenBets() {
  //const provider = useEthersProvider();

  const [ seconds, setSeconds ] = useState<string>('');
  
  // This is wrong - should get timestamp from last block, but
  // haven't discovered how to do that with wagmi yet.
  const [ until, setUntil ] = useState<number>(Math.round(Date.now() / 1000) + 60);
  // const currentBlock = await ethers.provider.getBlock("latest");
  // const timestamp = currentBlock?.timestamp ?? 0;
  
  const { config } = usePrepareContractWrite({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: Lottery.abi,
    functionName: 'openBets',
    args: [until],
  })

  const { data, write } = useContractWrite(config);
 
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const onChangeDuration = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sec = parseInt(e.target.value)
    setSeconds(e.target.value);
    setUntil(Math.round(Date.now() / 1000) + sec);
  }

  return (
    <div>
      <p>Enter number of seconds to open bets for: <input type="text" value={seconds} onChange={onChangeDuration}/></p>
      <button onClick={() => write?.()}>Open Bets</button>
    </div>
  )
}

function BuyTokens() {
  const { address } = useAccount();
  const [amount, setAmount] = useState<string>('0.0');

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: Lottery.abi,
    functionName: 'purchaseTokens',
  });

  return (
    <div>
      <h1>Buy Tokens</h1>
      <p>Enter amount of SEP to buy tokens with: <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)}/></p>
      <button onClick={() => write?.({value: ethers.utils.parseEther(amount).toBigInt()})} disabled={isLoading}>Buy Tokens</button>
      { isLoading && <p>Waiting for transaction to complete...</p> }
      { isSuccess && <p>Transaction complete. Hash: {data?.hash}</p> }
    </div>
  );
}

function CloseLottery() {
  const { config } = usePrepareContractWrite({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: Lottery.abi,
    functionName: 'closeLottery',
    args: [],
  })

  const { data, write } = useContractWrite(config);
 
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <div>
      <button onClick={() => write?.()} disabled={!write}>Close Lottery</button>
      { isLoading && <p>Waiting for transaction to complete...</p> }
      { isSuccess && <p>Transaction complete. Hash: {data?.hash}</p> }
    </div>
  );
}

function TokenBalance() {
  const { address } = useAccount();

  let { data, isError, isLoading, refetch } = useContractRead({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: LotteryToken.abi,
    functionName: 'balanceOf',
    args: [address],
    onError(error) {
      console.log('balanceOf error: ', error)
    },
    onSuccess(data) {
      console.log('balanceOf success: ', data);
    },
  });

  const displayBalance = (data: any) => {
    try {
      return <span>Token balance: {ethers.utils.formatUnits(data)}</span>
    } catch (e) {
      return <span>Token balance: 0 (possible error)</span>
    } 
  }

  return (
    <div>
      <span>Your token Balance: </span>
      { isLoading && <span>Loading...</span> }
      { isError && <span>Error</span> }
      { !isError && displayBalance(data) }
      <button onClick={() => refetch()} disabled={isLoading}>Refresh</button>
    </div>
  );
}

function Bet() {
  const [amount, setAmount] = useState<string>('0');

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: Lottery.abi,
    functionName: 'bet',
  });

  return (
    <div>
      <h3>Place a Bet</h3>
      <p>Number of bets to place: <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)}/></p>
      <button onClick={() => write?.()} disabled={isLoading}>Buy Tokens</button>
      { isLoading && <p>Waiting for transaction to complete...</p> }
      { isSuccess && <p>Transaction complete. Hash: {data?.hash}</p> }
      { !isSuccess && <p>Transaction failed.</p>}
    </div>
  );
}
