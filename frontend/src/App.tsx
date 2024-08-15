import React from 'react';
import { Container, Box, Card, CardContent, Typography } from '@mui/material';
import WalletGenerator from './components/WalletGenerator';
import ContractDeployer from './components/ContractDeployer';
import ContractAccessor from './components/ContractAccessor';

const App: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 5 }}>
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Wallet Generator
            </Typography>
            <WalletGenerator />
           </CardContent>
        </Card>
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Contract Deployer
            </Typography>
            <ContractDeployer />
          </CardContent>
        </Card>
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Contract Accessor
           </Typography>
            <ContractAccessor />
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default App;
