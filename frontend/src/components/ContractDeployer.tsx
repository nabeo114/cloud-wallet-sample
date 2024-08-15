import React, { useState } from 'react';
import { Card, CardContent, Button, TextField, Typography, IconButton, Divider, Tooltip, Alert } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';

const ContractDeployer: React.FC = () => {
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [abi, setAbi] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCopyContractAddress = () => {
    if (contractAddress) {
      navigator.clipboard.writeText(contractAddress);
    }
  };

  const handleCopyTransactionHash = () => {
    if (transactionHash) {
      navigator.clipboard.writeText(transactionHash);
    }
  };

  const deployContract = async () => {
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/deploy-contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'contractName': 'MyToken', 'constructorArgs': [] }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }

      const data = await response.json();
      setContractAddress(data.contractAddress);
      setTransactionHash(data.transactionHash);
      setAbi(data.abi);
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Error deploying contract:', errorMessage);
      setError(errorMessage);
    }
  };

  const getContractInfo = async () => {
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/get-contract-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'contractName': 'MyToken' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }

      const data = await response.json();
      setContractAddress(data.contractAddress);
      setTransactionHash(data.transactionHash);
      setAbi(data.abi);
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Error getting contract info:', errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={deployContract} sx={{ mt: 2 }}>
        Deploy Contract
      </Button>
      <Button variant="contained" color="secondary" onClick={getContractInfo} sx={{ mt: 2, ml: 2 }}>
        Get Contract Info
      </Button>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {(contractAddress || transactionHash || abi) && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            {contractAddress && (
              <>
                <Typography variant="h6">Contract Address:</Typography>
                <Typography variant="body1" color="textSecondary">
                  {contractAddress}
                  <Tooltip title="Copy to clipboard" placement="top">
                    <IconButton
                      aria-label="copy contract address"
                      onClick={handleCopyContractAddress}
                      edge="end"
                      sx={{ ml: 1 }}
                    >
                    <ContentCopy />
                    </IconButton>
                  </Tooltip>
                </Typography>
              </>
            )}
            <Divider sx={{ my: 2 }} />
            {transactionHash && (
              <>
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
              </>
            )}
            <Divider sx={{ my: 2 }} />
            {abi && (
              <>
                <Typography variant="h6">ABI:</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  value={abi}
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                  sx={{ mt: 1 }}
                />
              </>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ContractDeployer;
