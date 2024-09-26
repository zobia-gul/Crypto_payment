import React, { useState, useEffect } from 'react';
import './App.css';
import { Button, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MetamaskLogo from './assets/metamask.png';
import CoinbaseLogo from './assets/coinbase.png';
import WalletConnectLogo from './assets/walletconnect.png';
import { ethers } from 'ethers';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import WalletConnectProvider from "@walletconnect/web3-provider";

function App() {
  const [open, setOpen] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [coinbaseInstalled, setCoinbaseInstalled] = useState(false);

  //To check automatically that wallet(coinbase and metamask) is installed or not
  useEffect(() => {
    detectMetamask();
  }, []);

  // Function to detect MetaMask
  const detectMetamask = () => {
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
      setIsMetaMaskInstalled(true);
    } else {
      setIsMetaMaskInstalled(false);
    }
  };

  // Function to detect Coinbase Wallet
  const detectCoinbase = () => {
    const coinbaseWallet = new CoinbaseWalletSDK({
      appName: 'MyCryptoApp',
      appLogoUrl: 'https://example.com/logo.png',
      darkMode: false,
    });
    // Attempt to make a provider and check if it exists
    const ethereum = coinbaseWallet.makeWeb3Provider();
    return ethereum !== null;
  };

  // Handle Metamask payment
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

  // Handle Coinbase payment
  const handleCoinbasePayment = async () => {
    const coinbaseWallet = new CoinbaseWalletSDK({
      appName: 'MyCryptoApp',
      appLogoUrl: 'https://example.com/logo.png',
      darkMode: false,
    });

    const ethereum = coinbaseWallet.makeWeb3Provider();
    
    try {
      await ethereum.enable(); // Opens the Coinbase Wallet UI
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

  // Check if Coinbase Wallet is installed on component mount
  useEffect(() => {
    const isCoinbaseInstalled = detectCoinbase();
    setCoinbaseInstalled(isCoinbaseInstalled);
  }, []);

  // Handle WalletConnect payment
  const handleWalletConnectPayment = async () => {
    const provider = new WalletConnectProvider({
      infuraId: "YOUR_INFURA_ID", // Replace with your Infura Project ID
    });

    try {
      await provider.enable();
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const signer = web3Provider.getSigner();

      const tx = {
        to: 'RECIPIENT_ADDRESS',
        value: ethers.utils.parseEther('0.01')
      };

      const transactionResponse = await signer.sendTransaction(tx);
      console.log('WalletConnect transaction sent:', transactionResponse);
      alert('WalletConnect transaction sent!');
    } catch (error) {
      console.error('WalletConnect payment error:', error);
      alert('Transaction failed: ' + error.message);
    }
  };

  // Open wallet dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Close wallet dialog
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="App">
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Pay
      </Button>
  
      <Dialog
        open={open}
        onClose={handleClose} // Close dialog normally
        PaperProps={{
          style: {
            maxHeight: '80vh', // Set a maximum height for the dialog
            overflow: 'auto', // Enable scrolling if content overflows
            position: 'relative', // Ensure positioning context for close button
          },
        }}
      >
        <DialogTitle>
          Connect your wallet
          <IconButton
            aria-label="close"
            onClick={handleClose}
            style={{
              position: 'absolute', // Correct position property to absolute
              right: '12px', // Adjust position from the right
              top: '10px', // Adjust position from the top
              zIndex: 1, // Ensure it appears above other elements
              background: 'rgba(255, 0, 0, 0.7)', // Matte red background
              color: 'white', // White cross sign
              borderRadius: '50%', // Circle shape
              width: '15px', // Smaller width for the circular button
              height: '15px', // Smaller height for the circular button
              display: 'flex', // Center the icon
              alignItems: 'center', // Center vertically
              justifyContent: 'center', // Center horizontally
              transition: 'background 0.3s', // Smooth transition for hover effects
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 0, 0, 0.9)'; // Darker red on hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 0, 0, 0.7)'; // Reset on leave
            }}
          >
            <CloseIcon fontSize="small" style={{ fontSize: '14px' }} /> {/* Smaller cross sign */}
          </IconButton>
        </DialogTitle>
  
        <DialogContent>
          {isMetaMaskInstalled ? (
            <Button
              variant="outlined"
              onClick={handleMetamaskPayment}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start', // Aligns the content to the left
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
                justifyContent: 'flex-start', // Aligns the content to the left
                marginTop: '10px',
                width: '100%',
              }}
            >
              <img src={MetamaskLogo} alt="Metamask" width="30" style={{ marginRight: '10px' }} />
              Install MetaMask
            </Button>
          )}
  
          <Button
            variant="outlined"
            onClick={handleCoinbasePayment}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start', // Aligns the content to the left
              marginTop: '10px',
              width: '100%',
            }}
          >
            <img src={CoinbaseLogo} alt="Coinbase" width="30" style={{ marginRight: '10px' }} />
            {coinbaseInstalled ? 'Coinbase Wallet' : 'Install Coinbase Wallet'}
          </Button>
  
          <Button
            variant="outlined"
            onClick={handleWalletConnectPayment}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start', // Aligns the content to the left
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
