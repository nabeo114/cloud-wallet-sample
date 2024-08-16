import React, { useState } from 'react';
import Web3 from 'web3';
import { Card, CardContent, Button, TextField, Typography, IconButton, Tooltip, MenuItem, Select, InputLabel, FormControl, Alert } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material/Select';

const providerUrl = `https://polygon-amoy.infura.io/v3/891caf6a97ed4af6a314a6ba15fd63d1`;

// コントラクト名の定数定義
const CONTRACT_NAMES = {
  TOKEN: 'MyToken',
  NFT: 'MyNFT',
};

const ContractAccessor: React.FC = () => {
  const [contractName, setContractName] = useState<string>(CONTRACT_NAMES.TOKEN); // デフォルトを 'MyToken' に設定
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any | null>(null);
  const [totalSupply, setTotalSupply] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('');
  const [balance, setBalance] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<number>(0);
  const [tokenURI, setTokenURI] = useState<string | null>(null);
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

  const handleContractNameChange = (e: SelectChangeEvent<string>) => {
    const selectedContractName = e.target.value as string;
    setContractName(selectedContractName);
    setContract(null);
    setTotalSupply(null);
    setAddress('');
    setBalance(null);
    setTokenId(0);
    setTokenURI(null);
    setRecipientAddress('');
    setTransferAmount('');
    setTransactionHash(null);
    setContractError(null);
    setTransferError(null);
  };

  // コントラクト情報をロード
  const loadContract = async () => {
    setContractError(null);
    try {
      const response = await fetch('http://localhost:5000/get-contract-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'contractName': contractName }),
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

  // Total Supplyを取得 (ERC20のみ)
  const fetchTotalSupply = async (contractInstance: any) => {
    if (contractName !== CONTRACT_NAMES.TOKEN ) {
      return;
    }

    try {
      const totalSupply = await contractInstance.methods.totalSupply().call();
      setTotalSupply(totalSupply.toString());
    } catch (err) {
      const errorMessage = (err as Error).message;
      console.error('Error fetching total supply:', errorMessage);
      setContractError(errorMessage);
    }
  };

  // 指定したアドレスの残高を取得 (ERC20/ERC721)
  const fetchBalance = async () => {
    setContractError(null);
    setBalance(null);
    if (!contract || !address) {
      setContractError('Contract not loaded or address not provided');
      return;
    }

    try {
      const balance = await contract.methods.balanceOf(address).call();
      setBalance(balance.toString());
    } catch (err) {
      const errorMessage = (err as Error).message;
      console.error('Error fetching balance:', errorMessage);
      setContractError(errorMessage);
    }
  };

  // 指定したトークンIDのURIを取得 (ERC721のみ)
  const fetchTokenURI = async () => {
    setContractError(null);
    setTokenURI(null);
    if (!contract) {
      setContractError('Contract not loaded');
      return;
    }

    try {
      const tokenURI = await contract.methods.tokenURI(tokenId).call();
      setTokenURI(tokenURI);
    } catch (err) {
      const errorMessage = (err as Error).message;
      console.error('Error fetching token URI:', errorMessage);
      setContractError(errorMessage);
    }
  };

  // トークンを転送 (ERC20のみ)
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

  // NFTをミント (ERC721のみ)
  const mintNFT = async () => {
    setTransferError(null);
    setTransactionHash(null);
    if (!recipientAddress) {
      setTransferError('Address not provided');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/mint-nft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipientAddress }),
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
      console.error('Error minting NFT:', errorMessage);
      setTransferError(errorMessage);
    }
  }

  return (
    <>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="contract-name-label">Contract Name</InputLabel>
        <Select
          labelId="contract-name-label"
          value={contractName}
          onChange={handleContractNameChange}
          label="Contract Name"
        >
          <MenuItem value={CONTRACT_NAMES.TOKEN}>MyToken (ERC20)</MenuItem>
          <MenuItem value={CONTRACT_NAMES.NFT}>MyNFT (ERC721)</MenuItem>
        </Select>
      </FormControl>
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Button variant="contained" color="primary" onClick={loadContract} sx={{ mt: 2 }}>
            Load Contract
          </Button>
          {totalSupply && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6">Total Supply:</Typography>
                <Typography variant="body1" color="textSecondary">{totalSupply}</Typography>
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
                  {balance && (
                    <Card sx={{ mt: 3 }}>
                      <CardContent>
                        <Typography variant="h6">Balance:</Typography>
                        <Typography variant="body1" color="textSecondary">{balance}</Typography>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </>
          )}
          {contract && (contractName === CONTRACT_NAMES.NFT) && (
            <>
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Tooltip title="Please enter the token id for which you want to check the URI." placement="top" arrow>
                    <TextField
                      label="Token ID"
                      value={tokenId}
                      onChange={(e) => setTokenId(Number(e.target.value))}
                      fullWidth
                      sx={{ mt: 3 }}
                      type="number"
                    />
                  </Tooltip>
                  <Button variant="contained" color="primary" onClick={fetchTokenURI} sx={{ mt: 2 }}>
                    Get Token URI
                  </Button>
                  {tokenURI && (
                    <Card sx={{ mt: 3 }}>
                      <CardContent>
                        <Typography variant="h6">Token URI:</Typography>
                        <Typography variant="body1" color="textSecondary">{tokenURI}</Typography>
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
          {(contractName === CONTRACT_NAMES.TOKEN) && (
            <>
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
            </>
          )}
          {(contractName === CONTRACT_NAMES.NFT) && (
            <>
              <Tooltip title="Please enter the recipient address to which you want to mint the NFT." placement="top" arrow>
                <TextField
                  label="Recipient Address"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  fullWidth
                  sx={{ mt: 3 }}
                />
              </Tooltip>
              <Button variant="contained" color="primary" onClick={mintNFT} sx={{ mt: 2 }}>
                Mint NFT
              </Button>
            </>
          )}
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
