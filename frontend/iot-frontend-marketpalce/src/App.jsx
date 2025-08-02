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

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
   
   
    if (account && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
        if (accounts.length > 0 && accounts[0] !== account) {
          setAccount(accounts[0]);
        }
      });
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethProvider);
    } else {
      setProvider(null);
    }
  }, [account]);

  function handleWalletConnected(accountAddress) {
    setAccount(accountAddress);
  }

  function handleDeviceRegistered() {
    setRefreshFlag(prev => !prev);
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>IoT Marketplace Frontend</h1>

      {/* Pass account prop here! */}
      <WalletConnect account={account} onConnected={handleWalletConnected} />

      {provider && account && (
        <>
          <DeviceList
            provider={provider}
            account={account}
            refreshFlag={refreshFlag}
            onDevicesUpdated={setDevices}
          />
          <RegisterDevice
            provider={provider}
            onRegistered={handleDeviceRegistered}
          />
          <DataPublisher
            provider={provider}
            account={account}
            devices={devices}
          />
          <ListDeviceForSale
            provider={provider}
            account={account}
            devices={devices}
          />
          <MarketplaceListings provider={provider} account={account} />
          <AllDataList provider={provider} />
          <DataConsumption provider={provider} account={account} />
        </>
      )}

      <ToastContainer position="top-right" />
    </div>
  );
}

export default App;
