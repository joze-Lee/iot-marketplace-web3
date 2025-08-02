import React, { useEffect } from "react";
import "./WalletConnect.css";

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
    <div className="wallet-container">
      {account ? (
        <div className="wallet-connected">
          <p className="wallet-address">Connected: {account}</p>
          <button className="wallet-button disconnect" onClick={disconnectWallet}>Disconnect Wallet</button>
        </div>
      ) : (
        <button className="wallet-button connect" onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}
