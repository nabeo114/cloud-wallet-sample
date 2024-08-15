import React, { useState } from 'react';
import Web3 from 'web3';
import { Button, TextField, Card, CardContent, Typography, IconButton, Tooltip, Alert } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';

const providerUrl = `https://polygon-amoy.infura.io/v3/891caf6a97ed4af6a314a6ba15fd63d1`;

const ContractAccessor: React.FC = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any | null>(null);
  const [totalSupply, setTotalSupply] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [contractError, setContractError] = useState<string | null>(null);
  const [transferError, setTransferError] = useState<string | null>(null);

  const handleCopyTransactionHash = () => {
    if (transactionHash) {
      navigator.clipboard.writeText(transactionHash);
    }
  };

  // コントラクト情報をロード
  const loadContract = async () => {
    setContractError(null);
    try {
      const response = await fetch('http://localhost:5000/get-contract-info', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setContractError(errorData.error);
        return;
      }

      const data = await response.json();
      const contractInstance = createContract(data.contractAddress, data.abi);
      if (contractInstance) {
        fetchTotalSupply(contractInstance);
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Error loading contract:', errorMessage);
      setContractError(errorMessage);
    }
  };

  // コントラクトオブジェクトの生成
  const createContract = (address: string, abi: any) => {
    try {
      const web3Instance = new Web3(providerUrl);
      setWeb3(web3Instance);

      const parsedAbi = JSON.parse(abi);
      const contractInstance = new web3Instance.eth.Contract(parsedAbi, address);
      setContract(contractInstance);

      return contractInstance;
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Error creating contract:', errorMessage);
      setContractError(errorMessage);
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
      setContractError(errorMessage);
    }
  };

  // 指定したアドレスの残高を取得
  const fetchBalance = async () => {
    setContractError(null);
    setBalance(null);
    if (!contract || !address) {
      setContractError('Contract not loaded or address not provided');
      return;
    }

    try {
      const balance = await contract.methods.balanceOf(address).call();
      setBalance(balance);
    } catch (err) {
      const errorMessage = (err as Error).message;
      console.error('Error fetching balance:', errorMessage);
      setContractError(errorMessage);
    }
  };

  // トークンを転送
  const transferTokens = async () => {
    setTransferError(null);
    setTransactionHash(null);
    if (!recipientAddress || !transferAmount) {
      setTransferError('Address or amount not provided');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/transfer-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipientAddress, transferAmount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setTransferError(errorData.error);
        return;
      }

      const data = await response.json();
      setTransactionHash(data.transactionHash);
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Error transferring tokens:', errorMessage);
      setTransferError(errorMessage);
    }
  };

  return (
    <>
      <Card sx={{ mt: 3 }}>
        <CardContent>
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
            <Card sx={{ mt: 3 }}>
              <CardContent>
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
                {balance !== null && (
                  <Card sx={{ mt: 3 }}>
                    <CardContent>
                      <Typography variant="h6">Balance:</Typography>
                      <Typography variant="body1" color="textSecondary">{balance.toString()}</Typography>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
            </>
          )}
          {contractError && <Alert severity="error" sx={{ mt: 2 }}>{contractError}</Alert>}
        </CardContent>
      </Card>
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Tooltip title="Please enter the recipient address to which you want to transfer the tokens." placement="top" arrow>
            <TextField
              label="Recipient Address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              fullWidth
              sx={{ mt: 3 }}
            />
          </Tooltip>
          <Tooltip title="Please enter the amount of tokens you want to transfer." placement="top" arrow>
            <TextField
              label="Transfer Amount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              fullWidth
              sx={{ mt: 3 }}
            />
          </Tooltip>
          <Button variant="contained" color="primary" onClick={transferTokens} sx={{ mt: 2 }}>
            Transfer Tokens
          </Button>
          {transactionHash && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6">Transaction Hash:</Typography>
                <Typography variant="body1" color="textSecondary">
                  {transactionHash}
                  <Tooltip title="Copy to clipboard" placement="top">
                    <IconButton
                      aria-label="copy transaction hash"
                      onClick={handleCopyTransactionHash}
                      edge="end"
                      sx={{ ml: 1 }}
                    >
                    <ContentCopy />
                    </IconButton>
                  </Tooltip>
                </Typography>
              </CardContent>
            </Card>
          )}
          {transferError && <Alert severity="error" sx={{ mt: 2 }}>{transferError}</Alert>}
        </CardContent>
      </Card>
    </>
  );
};

export default ContractAccessor;
