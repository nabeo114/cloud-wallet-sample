import React, { useState } from 'react';
import { Card, CardContent, Button, TextField, Typography, IconButton, InputAdornment, Divider, Tooltip, Alert } from '@mui/material';
import { Visibility, VisibilityOff, ContentCopy } from '@mui/icons-material';

const WalletGenerator: React.FC = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [keystore, setKeystore] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };

  const generateWallet = async () => {
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/generate-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }

      const data = await response.json();
      setAddress(data.address);
      setKeystore(data.keystoreJson);
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Error generating wallet:', errorMessage);
      setError(errorMessage);
    }
  };

  const getWalletInfo = async () => {
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/get-wallet-info', {
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
      setAddress(data.address);
      setKeystore(data.keystoreJson);
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Error getting wallet info:', errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <>
      <Tooltip title="Please enter a password to encrypt the keystore JSON when generating the wallet." placement="top" arrow>
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Tooltip>
      <Button variant="contained" color="primary" onClick={generateWallet} sx={{ mt: 2 }}>
        Generate Wallet
      </Button>
      <Button variant="contained" color="secondary" onClick={getWalletInfo} sx={{ mt: 2, ml: 2 }}>
        Get Wallet Info
      </Button>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {(address || keystore) && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            {address && (
              <>
                <Typography variant="h6">Address:</Typography>
                <div>
                  <Typography variant="body1" color="textSecondary">
                    {address}
                    <Tooltip title="Copy to clipboard" placement="top">
                      <IconButton
                        aria-label="copy wallet address"
                        onClick={handleCopyAddress}
                        edge="end"
                        sx={{ ml: 1 }}
                      >
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                  <Typography variant="body2" color="primary">
                    <a
                      href={`https://www.oklink.com/amoy/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Amoy Explorer
                    </a>
                  </Typography>
                </div>
              </>
            )}
            <Divider sx={{ my: 2 }} />
            {keystore && (
              <>
                <Typography variant="h6">Keystore JSON:</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  value={keystore}
                  variant="outlined"
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </>
            )}
          </CardContent>
        </Card>
      )}
    </>
  )
};

export default WalletGenerator;
