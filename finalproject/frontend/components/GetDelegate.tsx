import { useState } from 'react';
import {useContractRead} from "wagmi";

import * as ERC20Votes from "../../smartcontracts/artifacts/contracts/ERC20Votes.sol/MyToken.json";

interface GetDelegateProps {
  contractAddress: `0x${string}`;
  walletAddress: `0x${string}`;
}

export function GetDelegate(props: GetDelegateProps) {
  const [ delegate, setDelegate ] = useState<string>('');

  const { isError, isLoading, refetch } = useContractRead({
    address: props.contractAddress,
    abi: ERC20Votes.abi,
    functionName: 'delegates',
    args: [props.walletAddress],
    onError(error){
      console.log(error);
    },
    onSuccess(data) {
      setDelegate(data as string);
    }
  });

  return (
    <div>
      <p>
        Your delegate address: 
        {
          isLoading ? <span>Loading... </span> : 
          isError   ? <span>Error occured! </span> :
                      <span>{delegate === '0x0000000000000000000000000000000000000000' ? 'None' : delegate} </span>
        }
        <button onClick={() => refetch()} disabled={isLoading}>Refresh</button>
      </p>
    </div>
  );
}
