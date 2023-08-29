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

const LOTTERY_CONTRACT_ADDRESS = '0x7Ba6f6D57ce440e5Bc477240Ad99A4D4CA864CA1';
const TOKEN_CONTRACT_ADDRESS = '0x900e5804B21Ebcab28F71E06A4bc501EA49c389D';

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
        <h3>Open Bets</h3>
        <OpenBets />
        <CloseLottery />
        <TokenBalance />
        <Approve />
        <BuyTokens />
        <Bet />
        <h3>Your Prize</h3>
        <CheckPrize />
        <ClaimPrize />
      </div>
    </div>
  );
}

function CheckState() {
  const [ open, setOpen ] = useState<boolean>(false);

  let { data, isError, isLoading, refetch } = useContractRead({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: Lottery.abi,
    functionName: 'betsOpen',
    onError(error) {
      console.log('betsOpen error: ', error)
    },
    onSuccess(data) {
      setOpen(data as boolean);
    }
  });

  if (isLoading) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error checking if bets are open</span>
  }

  return (
    <p>
      <span>Lottery is currently: {open ? 'open ' : 'closed ' }</span>
      <button onClick={() => refetch()} disabled={isLoading}>Refresh</button>
    </p>
  );
}

function OpenBets() {
  const [ seconds, setSeconds ] = useState<string>('');
  
  const [ duration, setDuration ] = useState<number>(0);
  const { config } = usePrepareContractWrite({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: Lottery.abi,
    functionName: 'openBets',
    args: [duration],
  })

  const { data, write } = useContractWrite(config);
 
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const onChangeDuration = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sec = parseInt(e.target.value)
    setSeconds(e.target.value);
    setDuration(sec);
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
      <h3>Buy Tokens</h3>
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
      <button onClick={() => write?.()}>Close Lottery</button>
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

function Approve() {
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: LotteryToken.abi,
    functionName: 'approve',
    args: [LOTTERY_CONTRACT_ADDRESS, ethers.constants.MaxUint256],
  });

  if (isLoading) {
    return <p>Waiting for transaction to complete...</p>
  }

  return (
    <div>
      <button onClick={() => write?.()} disabled={isLoading}>Approve use of LT0 Lottery Token</button>
      { isSuccess && <p>Transaction complete. Hash: {data?.hash}</p> }
      { !isSuccess && <p>Transaction failed.</p>}
    </div>
  );
}

function Bet() {
  const [amount, setAmount] = useState<string>('0');

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: Lottery.abi,
    functionName: 'betMany',
  });

  if (isLoading) {
    return <p>Waiting for transaction to complete...</p>
  }

  return (
    <div>
      <h3>Place a Bet</h3>
      <p>Number of bets to place: <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)}/></p>
      <button onClick={() => write?.({args: [amount]})} disabled={isLoading}>Buy Tokens</button>
      { isSuccess && <p>Transaction complete. Hash: {data?.hash}</p> }
      { !isSuccess && <p>Transaction failed.</p>}
    </div>
  );
}


function CheckPrize() {
  const { address } = useAccount();

  const [ prize, setPrize ] = useState<BigInt>();

  let { data, isError, isLoading, refetch } = useContractRead({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: Lottery.abi,
    functionName: 'prize',
    args: [address],
    onError(error) {
      console.log('betsOpen error: ', error)
    },
    onSuccess(data) {
      setPrize(data as BigInt);
    }
  });

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (isError) {
    return (
      <p>
        Error checking for prize <button onClick={() => refetch()} disabled={isLoading}>Refresh</button>
        <br/>
        Note that lottery must be closed to check for prize.
      </p>
    );
  }

  return (
    <p>
      <span>Prize: {prize?.toString()} </span>
      <button onClick={() => refetch()} disabled={isLoading}>Refresh</button>
    </p>
  );
}

function ClaimPrize() {
  const [amount, setAmount] = useState<string>('0');

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: Lottery.abi,
    functionName: 'ownerWithdraw',
  });

  if (isLoading) {
    return <p>Waiting for transaction to complete...</p>
  }

  return (
    <div>
      <h3>Withdraw Your Prize</h3>
      <p>Amount: <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)}/></p>
      <button onClick={() => write?.({args: [ethers.utils.parseUnits(amount)]})} disabled={isLoading}>Claim</button>
      { isSuccess && <p>Transaction complete. Hash: {data?.hash}</p> }
      { !isSuccess && <p>Transaction failed.</p>}
    </div>
  );
}