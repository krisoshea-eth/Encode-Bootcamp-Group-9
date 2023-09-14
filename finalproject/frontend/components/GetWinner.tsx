import React, { useState } from "react";
import {useContractRead} from "wagmi";
import {utils} from "ethers";

import * as TokenizedBallot from "../../smartcontracts/artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

interface GetWinnerProps {
  contractAddress: `0x${string}`;
}

export function GetWinner(props: GetWinnerProps) {
  const [winner, setWinner] = useState<string>('');

  const { data, isError, isLoading, refetch } = useContractRead({
    address: props.contractAddress,
    abi: TokenizedBallot.abi,
    functionName: 'winnerName',
    onSuccess(data) {
      const winnerBytes = data as string;
      const winner = utils.parseBytes32String(data as utils.BytesLike)
      setWinner(winner);
    },
    onError(error){
      console.log(error)
    }
  });

  return (
    <div>
      <p>
        And the winner is...
        {
          isLoading ? <span>Loading... </span> : 
          isError   ? <span>Error occured! </span> :
                      <span>{winner}!</span>
        }
      </p>
      <button onClick={() => refetch()} disabled={isLoading}>Refresh</button>
    </div>
  );
}
