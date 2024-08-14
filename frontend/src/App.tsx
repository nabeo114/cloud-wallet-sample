import React from 'react';
import { Container, Box, Typography, Divider } from '@mui/material';
import WalletGenerator from './components/WalletGenerator';
import ContractDeployer from './components/ContractDeployer';
import ContractAccessor from './components/ContractAccessor';

const App: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          1. Wallet Generator
        </Typography>
        <WalletGenerator />
        <Divider sx={{ my: 4 }} />
        <Typography variant="h4" gutterBottom>
          2. Contract Deployer
        </Typography>
        <ContractDeployer />
        <Divider sx={{ my: 4 }} />
        <Typography variant="h4" gutterBottom>
          3. Contract Accessor
        </Typography>
        <ContractAccessor />
      </Box>
    </Container>
  );
};

export default App;
