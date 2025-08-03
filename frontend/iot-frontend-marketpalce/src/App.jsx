import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import WalletConnect from "./components/WalletConnect";
import DeviceList from "./components/DeviceList";
import RegisterDevice from "./components/RegisterDevice";
import DataPublisher from "./components/DataPublisher";
import ListDeviceForSale from "./components/LIstDeviceForSale";
import MarketplaceListings from "./components/MarketplaceListings";
import DataConsumption from "./components/DataConsumption";
import AllDataList from "./components/AllDataList";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    if (window.ethereum) {
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethProvider);

      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        })
        .catch((err) => {
          console.error("Error fetching accounts:", err);
        });

      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    } else {
      setProvider(null);
    }
  }, []);

  function handleWalletConnected(accountAddress) {
    setAccount(accountAddress);
  }

  function handleDeviceRegistered() {
    setRefreshFlag((prev) => !prev);
  }

  useEffect(() => {
    // Debug: log devices whenever updated
    console.log("Devices updated in App:", devices);
  }, [devices]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">IoT Data Marketplace</h1>
      </header>

      <main className="main-content">
        <WalletConnect account={account} onConnected={handleWalletConnected} />

        {provider && account && (
          <div className="cards-container">
            <div className="card glass-card">
              <DeviceList
                provider={provider}
                account={account}
                refreshFlag={refreshFlag}
                onDevicesUpdated={setDevices}
              />
            </div>

            <div className="card glass-card">
              <RegisterDevice provider={provider} onRegistered={handleDeviceRegistered} />
            </div>

            <div className="card glass-card">
              <DataPublisher provider={provider} account={account} devices={devices} />
            </div>

            <div className="card glass-card">
              <ListDeviceForSale provider={provider} account={account} devices={devices} />
            </div>

            <div className="card glass-card">
              <MarketplaceListings provider={provider} account={account} />
            </div>

            <div className="card glass-card">
              <AllDataList provider={provider} />
            </div>

            <div className="card glass-card">
              <DataConsumption provider={provider} account={account} />
            </div>
          </div>
        )}
      </main>

      <ToastContainer position="top-right" />
    </div>
  );
}

export default App;
