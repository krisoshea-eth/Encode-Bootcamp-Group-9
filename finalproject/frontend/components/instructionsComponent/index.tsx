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
  utils,
} from "ethers";

import * as ERC20Votes from "../../../smartcontracts/artifacts/contracts/ERC20Votes.sol/MyToken.json";
import * as TokenizedBallot from "../../../smartcontracts/artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

import "./index.css";

const TOKENIZED_BALLOT_ADDRESS="0x868df35d41A82De3D9d4c0014d11Af1df4CEe880";

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
          <Vote/>
          <h2>Get the Winner</h2>
          <GetWinner/>
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
        {/* <WalletAction></WalletAction> */}
        <WalletBalance address={address}></WalletBalance>
        <GetVotingPower/>
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

function WalletAction() {
  const [signatureMessage, setSignatureMessage] = useState("");

  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage();
  return (
    <div>
      <form>
        <label>
          Enter the message to be signed:
          <input
            type="text"
            value={signatureMessage}
            onChange={(e) => setSignatureMessage(e.target.value)}
          />
        </label>
      </form>
      <button
        disabled={isLoading}
        onClick={() =>
          signMessage({
            message: signatureMessage,
          })
        }
      >
        Sign message
      </button>
      {isSuccess && <div>Signature: {data}</div>}
      {isError && <div>Error signing message</div>}
    </div>
  );
}

interface GetTotalSupplyProps {
  address: `0x${string}`;
}

function GetTotalSupplyFE(props: GetTotalSupplyProps) {
  const [ totalSupply, setTotalSupply ] = useState<string>('');

  const { isError, isLoading, refetch } = useContractRead({
    address: props.address,
    abi: ERC20Votes.abi,
    functionName: 'totalSupply',
    onSuccess(data) {
      setTotalSupply((data as BigInt).toString());
    }
  });

  return (
    <div>
      <p>
        Total Supply: 
        {
          isLoading ? <span>Loading... </span> : 
          isError   ? <span>Error occured! </span> :
                      <span>{totalSupply} </span>
        }
        <button onClick={() => refetch()} disabled={isLoading}>Refresh</button>
      </p>
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
  const [tokenContractAddress, setTokenContractAddress] = useState<`0x${string}`>('0xDEADF00D');

  return (
    <>
      <h2>Token Contract</h2>
      <TokenAddressFromAPI address={tokenContractAddress} setAddress={setTokenContractAddress} />
      <GetTotalSupplyFE address={tokenContractAddress}/>
      <h2>Mint New Tokens</h2>
      <MintTokens />
      <h2>Delegate</h2>
      <Delegate address={tokenContractAddress}/>
    </>
  );
}

function GetTotalSupply() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  const getTotalSupply = () => {
    setLoading(true);

    fetch("http://localhost:3001/get-total-supply")
      .then((res) => res.json())
      .then((data) => {
        console.log('total supply', data);
        setData(data);
        setLoading(false);
      }).catch((e) => {
        console.log('ERROR', e);
        setData(null);
        setLoading(false);
      });
  };

  if (isLoading) {
    return <div><p>Loading...</p></div>;
  }

  if (!data) {
    return (<button disabled={isLoading} onClick={() => getTotalSupply()}>Get Total Supply</button>);
  }

  return (
    <div>
      <button disabled={isLoading} onClick={() => getTotalSupply()}>Get Total Supply</button>
      <p>Total Supply: {data}</p>
    </div>
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
      {/* <button disabled={isLoading} onClick={() => {}}>No profile data</button> */}
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

interface DelegateProps {
  address: string;
};

function Delegate(props: DelegateProps) {
  const [address, setAddress] = useState<string>('');

  const { config } = usePrepareContractWrite({
    address: `0x${props.address}`,
    abi: ERC20Votes.abi,
    functionName: 'delegate',
    args: [address],
  })

  const { data, write } = useContractWrite(config);
 
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <div>
      Address: <input type="text" onChange={(e) => setAddress(e.target.value)}></input>
      <button disabled={isLoading} onClick={() => write?.()}>
        Delegate
      </button>
      {
        isLoading && <p>Delegating...</p>
      }
      {isSuccess && (
        <div>
          <p>Successfully delegated</p>
          <p>{`Transaction Hash: ${data?.hash}`}</p>
        </div>
      )}
    </div>
  )
}

function GetVotingPower() {
  const { address } = useAccount();

  const { data, isError, isLoading } = useContractRead({
    address: TOKENIZED_BALLOT_ADDRESS,
    abi: TokenizedBallot.abi,
    functionName: 'votingPower',
    args: [address],
    onError(error){
      console.log(error)
  }
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching voting power</p>;

  const votingPower = (data as BigInt).toString(); 

  return <p>Voting Power: {votingPower}</p>;
}

function Vote() {
  const [proposal, setProposal] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const { config } = usePrepareContractWrite({
    address: TOKENIZED_BALLOT_ADDRESS,
    abi: TokenizedBallot.abi,
    functionName: 'vote',
    args: [proposal, amount],
    onError(error){
      console.log(error)
    }
  });

  const { data, write } = useContractWrite(config);
 
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <div>
      <p>Proposal Number: <input type="text" onChange={(e) => setProposal(e.target.value)}></input></p>
      <p>Amount: <input type="text" onChange={(e) => setAmount(e.target.value)}></input></p>
      <button disabled={isLoading} onClick={() => write?.()}>
        Vote
      </button>
      {
        isLoading && <p>Voting...</p>
      }
      {isSuccess && (
        <div>
          <p>Successfully voted</p>
          <p>{`Transaction Hash: ${data?.hash}`}</p>
        </div>
      )}
    </div>
  )
}

function GetWinner() {
  const { data, isError, isLoading } = useContractRead({
    address: TOKENIZED_BALLOT_ADDRESS,
    abi: TokenizedBallot.abi,
    functionName: 'winnerName',
    onError(error){
      console.log(error)
    }
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching winner</p>;

  const winnerBytes = data as string;
  const winner = utils.parseBytes32String(data as utils.BytesLike);

  return (
    <div>
      <p>And the winner is... {winner}!</p>
    </div>
  );
}
