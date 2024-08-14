import React, { useState } from 'react';
import Web3 from 'web3';
import { Button, TextField, Card, CardContent, Typography, Alert } from '@mui/material';

const providerUrl = `https://polygon-amoy.infura.io/v3/891caf6a97ed4af6a314a6ba15fd63d1`;

const ContractAccessor: React.FC = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any | null>(null);
  const [ownerBalance, setOwnerBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadContract = async () => {
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/get-contract-info', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }

      const data = await response.json();
      initializeWeb3AndContract(data.contractAddress, data.abi);
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Error loading contract:', errorMessage);
      setError(errorMessage);
    }
  };

  const initializeWeb3AndContract = (address: string, abi: any) => {
    try {
        const web3Instance = new Web3(providerUrl);
        setWeb3(web3Instance);

        const parsedAbi = JSON.parse(abi);

        const contractInstance = new web3Instance.eth.Contract(parsedAbi, address);
        setContract(contractInstance);

      // コントラクトのbalanceOfメソッドを呼び出してオーナーのバランスを取得
      if (contractInstance) {
        // まずオーナーのアドレスを取得
        contractInstance.methods.owner().call()
          .then((ownerAddress: any) => {
            console.log(ownerAddress);
            // 取得したオーナーのアドレスでbalanceOfメソッドを呼び出す
            return contractInstance.methods.balanceOf(ownerAddress).call();
          })
          .then((balance: any) => {
            setOwnerBalance(balance);
            console.log(`Owner's balance: ${balance}`);
          })
          .catch((err: Error) => {
            const errorMessage = err.message;
            console.error('Error fetching owner balance:', errorMessage);
            setError(errorMessage);
          });
      }
    } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error initializing Web3 or contract:', errorMessage);
        setError(errorMessage);
      }
  };

  const callContractMethod = async (methodName: string, ...params: any[]) => {
    if (contract) {
      try {
        const result = await contract.methods[methodName](...params).call();
        console.log('Contract method result:', result);
      } catch (err) {
        const errorMessage = (err as Error).message;
        console.error('Error calling contract method:', errorMessage);
        setError(errorMessage);
      }
    } else {
      setError('Contract not initialized');
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={loadContract} sx={{ mt: 2 }}>
        Load Contract
      </Button>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {ownerBalance && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" >Owner's Balance:</Typography>
            <Typography variant="body1" color="textSecondary">{ownerBalance.toString()}</Typography>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ContractAccessor;
