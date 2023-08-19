import React, { useState, useEffect } from "react";
import {
  useAccount,
  useNetwork,
  useBalance,
  useSignMessage,
  useContractRead,
} from "wagmi";
import * as ERC20Votes from "../../assets/ERC20Votes.json";

import styles from "./instructionsComponent.module.css";

const ERC20_CONTRACT_ADDRESS="0xb78ea56431102C43BEa7cD373C986ce2145282f3"

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
  try {
    return (
      <div>
        <h2>Wallet Info</h2>
        <WalletInfo></WalletInfo>
        <h2>Get ERC20 Votes Contract Address (from backend)</h2>
        <TokenAddressFromAPI></TokenAddressFromAPI>
        <h2>Get Total Supply (from backend)</h2>
        <GetTotalSupply />
        <h2>Get Total Supply (from frontend)</h2>
        <GetTotalSupplyFE />
        <h2>Mint Tokens (from backend)</h2>
        <MintTokens />
      </div>
    );
  } catch (e) {
    console.log('ERROR', e)
  }
}

function WalletInfo() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  if (address)
    return (
      <div>
        <p>Your wallet address: {address}</p>
        <p>Connected to network: {chain?.name}</p>
        {/* <WalletAction></WalletAction> */}
        <WalletBalance address={address}></WalletBalance>
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

function GetTotalSupplyFE() {
  const { data, isError, isLoading } = useContractRead({
    address: ERC20_CONTRACT_ADDRESS,
    abi: ERC20Votes.abi,
    functionName: 'totalSupply',
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching total supply</p>;

  const totalSupply = (data as BigInt).toString(); 

  return (<p>Total Supply: {totalSupply}</p>);
}

function WalletBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useBalance({
    address: params.address,
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return (
    <div>
      Balance: {data?.formatted} {data?.symbol}
    </div>
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
    return <p>Loading...</p>;
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

function TokenAddressFromAPI() {
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

  if (isLoading) return <p>Loading...</p>;
  if (!data) return (<button disabled={isLoading} onClick={() => {}}>No profile data</button>);

  return (
    <div>
      <p>Address: {data.address}</p>
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
