import React, { useState } from 'react';
import Web3 from 'web3';
import { Button, TextField, Card, CardContent, Typography, Tooltip, Alert } from '@mui/material';

const providerUrl = `https://polygon-amoy.infura.io/v3/891caf6a97ed4af6a314a6ba15fd63d1`;

const ContractAccessor: React.FC = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any | null>(null);
  const [totalSupply, setTotalSupply] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // コントラクト情報をロード
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
      const contractInstance = initializeWeb3AndContract(data.contractAddress, data.abi);
      if (contractInstance) {
        fetchTotalSupply(contractInstance);
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Error loading contract:', errorMessage);
      setError(errorMessage);
    }
  };

  // Web3とコントラクトの初期化
  const initializeWeb3AndContract = (address: string, abi: any) => {
    try {
      const web3Instance = new Web3(providerUrl);
      setWeb3(web3Instance);

      const parsedAbi = JSON.parse(abi);
      const contractInstance = new web3Instance.eth.Contract(parsedAbi, address);
      setContract(contractInstance);

      return contractInstance;
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Error initializing Web3 or contract:', errorMessage);
      setError(errorMessage);
      return null;
    }
  };

  // Total Supplyを取得
  const fetchTotalSupply = async (contractInstance: any) => {
    try {
      const totalSupply = await contractInstance.methods.totalSupply().call();
      setTotalSupply(totalSupply);
    } catch (err) {
      const errorMessage = (err as Error).message;
      console.error('Error fetching total supply:', errorMessage);
      setError(errorMessage);
    }
  };

  // 指定したアドレスの残高を取得
  const fetchBalance = async () => {
    setError(null);
    if (!contract || !address) {
      setError('Contract not loaded or address not provided');
      return;
    }

    try {
      const balance = await contract.methods.balanceOf(address).call();
      setBalance(balance);
    } catch (err) {
      const errorMessage = (err as Error).message;
      console.error('Error fetching owner balance:', errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={loadContract} sx={{ mt: 2 }}>
        Load Contract
      </Button>
      {totalSupply && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6">Total Supply:</Typography>
            <Typography variant="body1" color="textSecondary">{totalSupply.toString()}</Typography>
          </CardContent>
        </Card>
      )}
      {contract && (
        <>
          <Tooltip title="Please enter the address for which you want to check the balance." placement="top" arrow>
            <TextField
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              fullWidth
              sx={{ mt: 3 }}
            />
          </Tooltip>
          <Button variant="contained" color="primary" onClick={fetchBalance} sx={{ mt: 2 }}>
            Get Balance
          </Button>
        </>
      )}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {balance !== null && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6">Balance:</Typography>
            <Typography variant="body1" color="textSecondary">{balance.toString()}</Typography>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ContractAccessor;
