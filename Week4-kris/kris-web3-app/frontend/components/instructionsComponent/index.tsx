import { useEffect, useState } from "react";
import styles from "./instructionsComponent.module.css";
import {ethers, utils} from "ethers";
import { useAccount, useBalance, useContractRead, useNetwork, useSignMessage, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";

const TOKEN_ADDRESS="0xb78ea56431102C43BEa7cD373C986ce2145282f3";

const TOKENIZED_BALLOT_ADDRESS="0x868df35d41A82De3D9d4c0014d11Af1df4CEe880";


export default function InstructionsComponent() {
  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <h1>Tokenized Ballot Voting App</h1>
        </div>
      </header>
      <div className={styles.get_started}>
        <PageBody></PageBody>
      </div>
    </div>
  );
}

function PageBody() {
  return (
    <div>
     <h2>Wallet Info</h2>
     <WalletInfo></WalletInfo>
     <h2>Get ERC20 Votes Contract Address (from backend)</h2>
     <TokenAddressFromApi></TokenAddressFromApi>
     <h2>Get Total Supply (from backend)</h2>
     <GetTotalSupply/>
     <h2>Get Total Supply (from frontend)</h2>
     <GetTotalSupplyFE />
     <h2>Mint Tokens (from backend)</h2>
     <MintTokens />
     <h2>Delegate</h2>
     <Delegate/>
     <h2>Voting Power</h2>
     <GetVotingPower/>
     <h2>Vote</h2>
     <Vote/>
     <h2>Get the Winner</h2>
     <GetWinner/>
    </div>
  );
}

function WalletInfo() {
  const { address, isConnecting, isDisconnected } = useAccount()
  const { chain } = useNetwork();
  if (address)
    return (
      <div>
        <p>Your account address is {address}</p>
        <p>Connected to the network {chain?.name}</p>
        <WalletAction></WalletAction>
        <WalletBalance address={address}></WalletBalance>
        <TokenName></TokenName>
        <TokenBalance address={address}></TokenBalance>
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

function WalletBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useBalance({
    address: params.address,
  })

  if (isLoading) return <div>Fetching balance…</div>
  if (isError) return <div>Error fetching balance</div>
  return (
    <div>
      Balance: {data?.formatted} {data?.symbol}
    </div>
  )
}

function TokenName() {
  const { data, isError, isLoading } = useContractRead({
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    abi: [
      {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [
          {
            name: "",
            type: "string",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "name",
  });

  const name = typeof data === "string" ? data : 0;

  if (isLoading) return <div>Fetching name…</div>;
  if (isError) return <div>Error fetching name</div>;
  return <div>Token name: {name}</div>;
}

function TokenBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useContractRead({
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    abi: [
      {
        constant: true,
        inputs: [
          {
            name: "_owner",
            type: "address",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            name: "balance",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "balanceOf",
    args: [params.address],
  });

  const balance = typeof data === "number" ? data : 0;

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return <div>Balance: {balance}</div>;
}

function RandomProfile() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://randomuser.me/api/")
      .then((res) => res.json())
      .then((data) => {
        setData(data.results[0]);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading profile info...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <div>
      <h1>
        Name: {data.name.title} {data.name.first} {data.name.last}
      </h1>
      <p>Email: {data.email}</p>
    </div>
  );
}

function TokenAddressFromApi() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/get-address")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading token info...</p>;
  if (!data) return <p>No token data</p>;

  return (
    <div>
      <p>Token Address: {data.address}</p>
    </div>
)};

  function MintTokens(params: { address: `0x${string}` }) {
    const [data, setData] = useState<any>(null);
    const [isLoading, setLoading] = useState(false);

    if (isLoading) return <p>Requesting tokens from API</p>;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, quantity })
    };

    if (!data) 
    return (  
    <button
      disabled={isLoading}
      onClick={() =>
        setLoading(true);
        fetch("http://localhost:3001/mint-tokens", requestOptions)
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          setLoading(false);
        })
      }
    >
      Sign message
    </button>)
    return (
      <div>
        <p>Mint Success: {data.success ? 'worked' : 'failed'} </p>
        <p>Transaction Hash: {data.txHash}</p>
      </div>
  )};