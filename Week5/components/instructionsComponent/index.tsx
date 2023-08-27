import styles from "./instructionsComponent.module.css";
import { useAccount, useNetwork, useSignMessage, useBalance, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
import { useState, useEffect } from "react";
import {ethers, utils } from "ethers";

import Lottery from "../../assets/Lottery.json";
import { parse } from "path";

const LOTTERY_ADDRESS = "0x85Fe4a9a430085494264aE8D58aa92801202d39a";
const TOKEN_RATIO = 1n;
const DECIMALS = 1000000000000000000n;

export default function InstructionsComponent(){
    return(
        <div className={styles.container}>
            <header className={styles.header_container}>
                <div className={styles.header}>
                    <h1>Group 9 Lottery dApp</h1>
                </div>
            </header>
            <p className={styles.get_started}>
                <PageBody></PageBody>
            </p>
        </div>
    )
}

function PageBody(){
    const {address, status } = useAccount()
    return (
        <div>
            <CheckState></CheckState>
            <StartLottery></StartLottery>
            <CloseLottery></CloseLottery>
            <TopUpTokens></TopUpTokens>
            <Bet></Bet>
            <WithdrawFees></WithdrawFees>
        </div>
    )
}

function StartLottery(){
    //TO DOO - start lottery 
    //throws error gracefully if not owner
    const [duration, setDuration] = useState<string>('');

    const {config} = usePrepareContractWrite({
        address: LOTTERY_ADDRESS,
        abi: Lottery.abi,
        functionName: "openBets",
        args: [duration],
        onError(error){
            console.log("Error starting lottery. Ensure owner is the one starting")
        }
    })

    const { data, write } = useContractWrite(config);
   
    const { isLoading, isSuccess } = useWaitForTransaction({
      hash: data?.hash,
    });

    return (
        <div>
          <p>Duration (in seconds): <input type="text" onChange={(e) => setDuration(e.target.value)}></input></p>
          <button disabled={isLoading} onClick={() => write?.()}>
            Start Lottery
          </button>
          {
            isLoading && <p>Starting lottery...</p>
          }
          {isSuccess && (
            <div>
              <p>Successfully started lottery. Bets are open!</p>
              <p>{`Transaction Hash: ${data?.hash}`}</p>
            </div>
          )}
        </div>
      )
}

//NEED TO FIX to link button to logic
function CloseLottery(){
    //TO DO - end lottery
    //anyone, so should not have error
    const [isLoading_button, setLoading] = useState<boolean>(false);
    const {config} = usePrepareContractWrite({
        address: LOTTERY_ADDRESS,
        abi: Lottery.abi,
        functionName: "closeLottery",
        onError(error){
            console.log(error)
        }
    })
   
    const { data, write } = useContractWrite(config);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
      });

      return (
        <div>
          <button disabled={isLoading_button} onClick={() => {
            setLoading(true);
            //DO SOMETHING
            console.log("clicky thingy");
          }}>
            Close Lottery
          </button>
          {
            isLoading && <p>Closing lottery...</p>
          }
          {isSuccess && (
            <div>
              <p>Successfully closed lottery. Bets are closed now</p>
              <p>{`Transaction Hash: ${data?.hash}`}</p>
            </div>
          )}
          <CheckState></CheckState>
        </div>
      )
    //display results 
    //IDEA - perhaps only notify winner(check awards/increased token balance)
}


function CheckState(){
    //TO DO - check if lottery is open
    const {data, isError, isLoading} = useContractRead({
        address: LOTTERY_ADDRESS,
        abi: Lottery.abi,
        functionName: "betsOpen"
    });

    const open = typeof data === "boolean" ? data : null;

    if(isLoading) return <div>Checking state of lottery</div>;
    if(isError) return <div>Error fetching lottery state</div>;
    return <div>The lottery is {open ? "open" : "closed"}</div>;
    //TO DO - add closing time 

}

function TopUpTokens(){
    const [amount, setAmount] = useState<bigint>(0n);

    const {config} = usePrepareContractWrite({
        address: LOTTERY_ADDRESS,
        abi: Lottery.abi,
        functionName: "purchaseTokens",
        value: [amount],
        
        onError(error){
            console.log(error)
        }
    })

    const { data, write } = useContractWrite(config);
   
    const { isLoading, isSuccess } = useWaitForTransaction({
      hash: data?.hash,
    });

    return (
        
        <div>
            
          <p>How many tokens to buy? <input type="text" onChange={(e) => {
            const val = e.target.value;
            //need to convert to wei?
            setAmount(BigInt(val))
            }
            }></input></p>
          <button disabled={isLoading} onClick={() => write?.()}>
            Purchase tokens
          </button>
          {
            isLoading && <p>{`Purchasing ${amount/DECIMALS}...`}</p>
          }
          {isSuccess && (
            <div>
              <p>Successfully topped up tokens.</p>
              <p>{`Transaction Hash: ${data?.hash}`}</p>
            </div>
          )}
        </div>
      )
}

//TO DO - test
function Bet(){
    //TO DO - bet with account
    const [betAmount, setBetAmount] = useState<string>('');

    const {config} = usePrepareContractWrite({
        address: LOTTERY_ADDRESS,
        abi: Lottery.abi,
        functionName: "betMany",
        args: [betAmount],
        onError(error){
            console.log(error)
        }
    })

    const { data, write } = useContractWrite(config);
   
    const { isLoading, isSuccess } = useWaitForTransaction({
      hash: data?.hash,
    });

    return (
        <div>
          <p>Bet amount?: <input type="text" onChange={(e) => setBetAmount(e.target.value)}></input></p>
          <button disabled={isLoading} onClick={() => write?.()}>
            Place Bet
          </button>
          {
            isLoading && <p>Betting...</p>
          }
          {isSuccess && (
            <div>
              <p>Successfully placed bet</p>
              <p>{`Transaction Hash: ${data?.hash}`}</p>
            </div>
          )}
        </div>
      )
}

//TO DO - test
function WithdrawFees(){
    //TO DO - only owner withdraws fees
    //graceful error if not owner
    //only call if using owner address?
    const [amount, setAmount] = useState<bigint>();

    const {config} = usePrepareContractWrite({
        address: LOTTERY_ADDRESS,
        abi: Lottery.abi,
        functionName: "ownerWithdraw",
        args: [amount],
        onError(error){
            console.log(error)
        }
    })

    const { data, write } = useContractWrite(config);
   
    const { isLoading, isSuccess } = useWaitForTransaction({
      hash: data?.hash,
    });

    return (
        <div>
          <p>Amount of lottery fees to withdraw: <input type="text" onChange={(e) => setAmount(BigInt(e.target.value))}></input></p>
          <button disabled={isLoading} onClick={() => write?.()}>
            Withdraw 
          </button>
          {
            isLoading && <p>Withdrawing...</p>
          }
          {isSuccess && (
            <div>
              <p>Successfully withdrew funds</p>
              <p>{`Transaction Hash: ${data?.hash}`}</p>
            </div>
          )}
        </div>
      )
}

function displayOwnerPool(){

}

function CheckPrize(){
    //TO DO - check if current address has won
    //Checks tokens. Token increase?
}

function BurnTokens(){
    //TO DO
}
