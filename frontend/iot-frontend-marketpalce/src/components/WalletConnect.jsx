import React, { useEffect } from "react";

export default function WalletConnect({ account, onConnected }) {

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (accounts.length > 0) {
          onConnected(accounts[0]);
        }
      } catch (error) {
        console.error("User rejected connection", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  }

  function disconnectWallet() {
    onConnected(null);
  }

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          onConnected(accounts[0]);
        }
      };
      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, [onConnected]);

  return (
    <div>
      {account ? (
        <div>
          <p>Connected account: {account}</p>
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
        </div>
      ) : (
        
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}
