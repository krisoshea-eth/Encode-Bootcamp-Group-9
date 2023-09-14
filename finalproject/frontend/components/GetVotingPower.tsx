import { useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';

import * as TokenizedBallot from '../../smartcontracts/artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json';

interface GetVotingPowerProps {
  contractAddress: `0x${string}`;
}

export function GetVotingPower(props: GetVotingPowerProps) {
  const { address } = useAccount();
  const [ votingPower, setVotingPower ] = useState<string>('');

  const { data, isError, isLoading, refetch } = useContractRead({
    address: props.contractAddress,
    abi: TokenizedBallot.abi,
    functionName: 'votingPower',
    args: [address],
    onSuccess(data) {
      setVotingPower((data as BigInt).toString());
    },
    onError(error){
      console.log(error)
  }
  });

  return (
    <div>
      <p>
        Voting Tokens: 
        {
          isLoading ? <span>Loading... </span> : 
          isError   ? <span>Error occured! </span> :
                      <span>{votingPower} </span>
        }
      </p>
      <p>
        Voting Power: 
        {
          isLoading ? <span>Loading... </span> : 
          isError   ? <span>Error occured! </span> :
                      <span>{Math.round(Math.sqrt(parseFloat(votingPower)) * 100) / 100} </span>
        }
        <button onClick={() => refetch()} disabled={isLoading}>Refresh</button>
      </p>
    </div>
  );
}
