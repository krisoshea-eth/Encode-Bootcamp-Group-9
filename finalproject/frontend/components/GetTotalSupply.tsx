import { useState } from 'react';
import { useContractRead } from 'wagmi';

import * as ERC20Votes from '../../smartcontracts/artifacts/contracts/ERC20Votes.sol/MyToken.json';

interface GetTotalSupplyProps {
  contractAddress: `0x${string}`;
}

export function GetTotalSupplyFE(props: GetTotalSupplyProps) {
  const [ totalSupply, setTotalSupply ] = useState<string>('');

  const { isError, isLoading, refetch } = useContractRead({
    address: props.contractAddress,
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

export function GetTotalSupplyBE() {
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