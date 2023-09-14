import React, { useState, useEffect } from "react";
import {
  useAccount,
  useNetwork,
  useBalance,
} from "wagmi";

import {Delegate} from "./Delegate";
import {GetDelegate} from "./GetDelegate";
import {GetTotalSupplyFE} from "./GetTotalSupply";
import {GetVotingPower} from "./GetVotingPower";
import {GetWinner} from "./GetWinner";
import {Undelegate} from "./Undelegate";
import {Vote} from "./Vote";

import "./index.css";

const TOKENIZED_BALLOT_ADDRESS="0x13a6824433e29485b9Fe67c87c26c4c66aE11E57";

export default function InstructionsComponent() {
    return (
      <div className={"Main-Content"}>

        <div className={"Card"}>
          <h2>Your Wallet</h2>
          <WalletInfo></WalletInfo>
        </div>
        
        <div className={"Card"}>
          <TokenContractPane/>
        </div>

        <div className={"Card"}>
          <h2>Vote</h2>
          <Vote contractAddress={TOKENIZED_BALLOT_ADDRESS}/>
          <h2>Get the Winner</h2>
          <GetWinner contractAddress={TOKENIZED_BALLOT_ADDRESS}/>
        </div>

      </div>
    );
}

function WalletInfo() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  if (address)
    return (
      <div>
        <p>Address: {address}</p>
        <p>Network: {chain?.name}</p>
        <WalletBalance address={address}></WalletBalance>
        <GetVotingPower contractAddress={TOKENIZED_BALLOT_ADDRESS}/>
      </div>
    );
  if (isConnecting)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  if (isDisconnected)
    return (
      <div>
        <p>Wallet disconnected. Connect wallet to continue</p>
      </div>
    );
  return (
    <div>
      <p>Connect wallet to continue</p>
    </div>
  );
}

function WalletBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useBalance({
    address: params.address,
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;

  return <p>Balance: {data?.formatted} {data?.symbol}</p>;
}

function TokenContractPane() {
  const { address } = useAccount();
  const [tokenContractAddress, setTokenContractAddress] = useState<`0x${string}`>('0xDEADF00D');

  return (
    <>
      <h2>Token Contract</h2>
      <TokenAddressFromAPI address={tokenContractAddress} setAddress={setTokenContractAddress} />
      <GetTotalSupplyFE contractAddress={tokenContractAddress}/>
      <h2>Mint New Tokens</h2>
      <MintTokens />
      <h2>Delegate</h2>
      <Delegate contractAddress={tokenContractAddress}/>
      <Undelegate contractAddress={tokenContractAddress} walletAddress={address as `0x${string}`}/>
      <h2>Your current Delegate</h2>
      <GetDelegate contractAddress={tokenContractAddress} walletAddress={address as `0x${string}`}/>
    </>
  );
}

interface TokenAddressFromAPIProps {
  address: `0x${string}`;
  setAddress: (address: `0x${string}`) => void;
}

function TokenAddressFromAPI(props: TokenAddressFromAPIProps) {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/get-address")
      .then((res) => res.json())
      .then((data) => {
        props.setAddress(data.address);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {
        isLoading      ? <p>Loading...</p> :
        !props.address ? <p>No data</p> :
                         <p>Address: {props.address}</p>
      }
    </div>
  );
}

function MintTokens() {
  // address to mint to
  const [address, setAddress] = useState<string>('');

  // quantity of tokens to mint
  const [quantity, setQuantity] = useState<number>(0);

  // response data from BE
  const [data, setData] = useState<any>(null);

  // loading state
  const [isLoading, setLoading] = useState<boolean>(false);

  // handle address input
  const onChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setAddress(e.target.value);
  }

  // handle quantity input
  const onChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    let quantity = 0;
    try {
      quantity = parseInt(e.target.value)
    } catch (e) {
      console.log('ERROR', e);
    }
    setQuantity(quantity);
  }

  // handles sending mint request to BE
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    fetch("http://localhost:3001/mint", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ address, quantity })
    }).then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((e) => {
        console.log('error with mint request', e);
        setLoading(false);
      });
  }

  // while waiting for response from BE, show loading
  if (isLoading) {
    return <p>Minting tokens...</p>;
  }

  // if no response from BE and no request in flight, show form
  if (!data) {
    return (
      <form onSubmit={onSubmit}>
        <p>
          <label>Address to mint to:</label><input type="text" onChange={onChangeAddress}></input>
        </p>
        <p>
          <label>Number of tokens:</label><input type="text" onChange={onChangeQuantity}></input>
        </p>
        <button disabled={isLoading} type="submit">Mint</button>
      </form>
    );
  }

  // if response from BE and done loading, show response
  return (
    <div>
      <p>Mint Success: {data.success ? "Success" : "Failed"}</p>
      <p>Transaction Hash: {data.transactionHash}</p>
    </div>
  )
}
