import { useState } from 'react';
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';

import * as TokenizedBallot from '../../smartcontracts/artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json';

interface VoteProps {
  contractAddress: `0x${string}`;
}

export function Vote(props: VoteProps) {
  const [proposal, setProposal] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: props.contractAddress,
    abi: TokenizedBallot.abi,
    functionName: 'vote',
    args: [proposal, amount],
  });

  const { data, error, isError, write } = useContractWrite(config);
 
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <div>
      <p>Proposal Number: <input type="text" onChange={(e) => setProposal(e.target.value)}></input></p>
      <p>Amount: <input type="text" onChange={(e) => setAmount(e.target.value)}></input></p>
      <button disabled={isLoading} onClick={() => write?.()}>Vote</button>

      { isPrepareError && (<p></p>) }
      { isLoading && <p>Waiting for transaction to complete...</p>}
      { isSuccess && <p>Transaction complete. Hash: {data?.hash}</p> }
      { isError && (<p>Error: {error?.message}</p>)}
      
    </div>
  );
}
