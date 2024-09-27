import React, { useState, useEffect } from 'react';
import './App.css';
import { Button, Dialog, DialogTitle, DialogContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MetamaskLogo from './assets/metamask.png';
import CoinbaseLogo from './assets/coinbase.png';
import WalletConnectLogo from './assets/walletconnect.png';
import { ethers } from 'ethers';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import WalletConnectProvider from "@walletconnect/web3-provider";

function App() {
  // State to control dialog visibility and wallet installation status
  const [open, setOpen] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [coinbaseInstalled, setCoinbaseInstalled] = useState(false);

  // Hardcoded ETH amount for the time being (you can later fetch from a database)
  const priceInEth = 0.01; // Example: 0.01 ETH
  
  // useEffect to check if MetaMask and Coinbase wallets are installed on component mount
  useEffect(() => {
    detectMetamask();
    const isCoinbaseInstalled = detectCoinbase();
    setCoinbaseInstalled(isCoinbaseInstalled);
  }, []);

  // Function to detect if MetaMask is installed
  const detectMetamask = () => {
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
      setIsMetaMaskInstalled(true);
    } else {
      setIsMetaMaskInstalled(false);
    }
  };

  // Function to detect if Coinbase Wallet is installed
  const detectCoinbase = () => {
    const coinbaseWallet = new CoinbaseWalletSDK({
      appName: 'MyCryptoApp',
      appLogoUrl: 'https://example.com/logo.png',
      darkMode: false,
    });
    const ethereum = coinbaseWallet.makeWeb3Provider();
    return ethereum !== null;
  };

  // Handle payment using MetaMask wallet
  const handleMetamaskPayment = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tx = { to: 'RECIPIENT_ADDRESS', value: ethers.utils.parseEther('0.01') };
        const transactionResponse = await signer.sendTransaction(tx);
        console.log('Transaction sent:', transactionResponse);
        alert('Transaction sent!');
      } catch (error) {
        console.error('Error with Metamask payment:', error);
        alert('Transaction failed');
      }
    } else {
      alert('Please install MetaMask browser extension');
    }
  };

  // Handle payment using Coinbase Wallet
  const handleCoinbasePayment = async () => {
    const coinbaseWallet = new CoinbaseWalletSDK({
      appName: 'MyCryptoApp',
      appLogoUrl: 'https://example.com/logo.png',
      darkMode: false,
    });

    const ethereum = coinbaseWallet.makeWeb3Provider();

    try {
      await ethereum.enable(); // Opens Coinbase Wallet UI
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const tx = { to: 'RECIPIENT_ADDRESS', value: ethers.utils.parseEther('0.01') };
      const transactionResponse = await signer.sendTransaction(tx);
      console.log('Coinbase transaction sent:', transactionResponse);
      alert('Coinbase transaction sent!');
    } catch (error) {
      console.error('Coinbase payment error:', error);
      alert('Transaction failed: ' + error.message);
    }
  };

  // Handle payment using WalletConnect
  const handleWalletConnectPayment = async () => {
    const provider = new WalletConnectProvider({
      infuraId: "YOUR_INFURA_ID", // Replace with your Infura Project ID
    });

    try {
      await provider.enable();
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const signer = web3Provider.getSigner();
      const tx = { to: 'RECIPIENT_ADDRESS', value: ethers.utils.parseEther('0.01') };
      const transactionResponse = await signer.sendTransaction(tx);
      console.log('WalletConnect transaction sent:', transactionResponse);
      alert('WalletConnect transaction sent!');
    } catch (error) {
      console.error('WalletConnect payment error:', error);
      alert('Transaction failed: ' + error.message);
    }
  };

  // Open dialog for wallet selection
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="App">
      {/* Pay button to trigger wallet dialog */}
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Pay
      </Button>

      {/* Wallet connection dialog */}
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose();
          }
        }}
        PaperProps={{
          style: {
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative',
          },
        }}
        BackdropProps={{ style: { pointerEvents: 'none' } }} // Disable backdrop click
      >
        {/* Dialog title with close button */}
        <DialogTitle>
          Connect your wallet
          <IconButton
            aria-label="close"
            onClick={handleClose}
            style={{
              position: 'absolute',
              right: '12px',
              top: '10px',
              zIndex: 1,
              background: 'rgba(255, 0, 0, 0.7)',
              color: 'white',
              borderRadius: '50%',
              width: '15px',
              height: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.3s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 0, 0, 0.9)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 0, 0, 0.7)'; }}
          >
            <CloseIcon fontSize="small" style={{ fontSize: '14px' }} />
          </IconButton>
        </DialogTitle>

        {/* Wallet selection content */}
        <DialogContent>
          {/* Display the ETH price to pay */}
          <Typography variant="h6" gutterBottom>
            Amount to pay: {priceInEth} ETH
          </Typography>
          {/* Metamask payment option */}
          {isMetaMaskInstalled ? (
            <Button
              variant="outlined"
              onClick={handleMetamaskPayment}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginTop: '10px',
                width: '100%',
              }}
            >
              <img src={MetamaskLogo} alt="Metamask" width="30" style={{ marginRight: '10px' }} />
              Metamask
            </Button>
          ) : (
            <Button
              variant="outlined"
              disabled
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginTop: '10px',
                width: '100%',
              }}
            >
              <img src={MetamaskLogo} alt="Metamask" width="30" style={{ marginRight: '10px' }} />
              Install MetaMask
            </Button>
          )}

          {/* Coinbase payment option */}
          <Button
            variant="outlined"
            onClick={handleCoinbasePayment}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginTop: '10px',
              width: '100%',
            }}
          >
            <img src={CoinbaseLogo} alt="Coinbase" width="30" style={{ marginRight: '10px' }} />
            {coinbaseInstalled ? 'Coinbase' : 'Install Coinbase Wallet'}
          </Button>

          {/* WalletConnect payment option */}
          <Button
            variant="outlined"
            onClick={handleWalletConnectPayment}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginTop: '10px',
              width: '100%',
            }}
          >
            <img src={WalletConnectLogo} alt="WalletConnect" width="30" style={{ marginRight: '10px' }} />
            WalletConnect
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
