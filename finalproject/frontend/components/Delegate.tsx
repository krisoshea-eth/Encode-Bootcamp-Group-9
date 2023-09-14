import React, { useState } from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import * as ERC20Votes from "../../smartcontracts/artifacts/contracts/ERC20Votes.sol/MyToken.json";

interface DelegateProps {
  contractAddress: `0x${string}`;
};

export function Delegate(props: DelegateProps) {
  const [address, setAddress] = useState<string>('');

  const { config } = usePrepareContractWrite({
    address: props.contractAddress,
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
      Address: <input type="text" onChange={(e) => setAddress(e.target.value)} /> 
      <button disabled={isLoading} onClick={() => write?.()}>Delegate</button>
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
