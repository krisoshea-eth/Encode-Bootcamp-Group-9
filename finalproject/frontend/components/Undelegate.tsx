import React from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import * as ERC20Votes from "../../smartcontracts/artifacts/contracts/ERC20Votes.sol/MyToken.json";

export interface UndelegateProps {
  contractAddress: `0x${string}`;
  walletAddress: `0x${string}`;
}

export function Undelegate(props: UndelegateProps) {
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: props.contractAddress,
    abi: ERC20Votes.abi,
    functionName: 'delegate',
    args: [props.walletAddress],
  });

  const { data, error, isError, write } = useContractWrite(config);
 
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <div>
      <button onClick={() => write?.()} disabled={isLoading}>Revoke</button>
      { isLoading && <p>Waiting for transaction to complete...</p>}
      { isSuccess && <p>Undelegate success. Hash: {data?.hash}</p> }
      {(isPrepareError || isError) && (<p>Error: {(prepareError || error)?.message}</p>)}
    </div>
  );
}
