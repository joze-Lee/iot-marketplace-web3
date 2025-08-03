import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import {
  MARKETPLACE_ADDRESS,
  MARKETPLACE_ABI,
  DEVICE_REGISTRY_ADDRESS,
  DEVICE_REGISTRY_ABI
} from "../constants";
import "./ListDeviceForSale.css";

export default function ListDeviceForSale({ provider, account }) {
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [priceEth, setPriceEth] = useState("");
  const [metadataURI, setMetadataURI] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!provider || !account) return;

    const contract = new ethers.Contract(
      DEVICE_REGISTRY_ADDRESS,
      DEVICE_REGISTRY_ABI,
      provider
    );

    async function fetchUserDevices() {
      try {
        // Call the new contract function that returns device IDs owned by account
        const deviceIds = await contract.getDevicesByOwner(account);

        // For each deviceId, get device info (name)
        const userDevices = await Promise.all(
          deviceIds.map(async (deviceId) => {
            const [name] = await contract.getDevice(deviceId);
            return { deviceId, name };
          })
        );

        setDevices(userDevices);

        if (userDevices.length > 0) {
          setSelectedDeviceId(userDevices[0].deviceId);
        }
      } catch (err) {
        console.error("Failed to fetch devices:", err);
        setError("Could not load your devices");
        toast.error("Failed to load your devices");
      }
    }

    fetchUserDevices();
  }, [provider, account]);

  const handleList = async () => {
    if (!selectedDeviceId || !priceEth) {
      toast.error("Please select a device and enter price");
      return;
    }

    const priceNumber = Number(priceEth);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      toast.error("Invalid price entered");
      return;
    }

    try {
      setLoading(true);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        MARKETPLACE_ADDRESS,
        MARKETPLACE_ABI,
        signer
      );
      const priceWei = ethers.parseEther(priceEth); // ethers v6
      const tx = await contract.listData(selectedDeviceId, priceWei);
      await tx.wait();

      toast.success("Device listed on marketplace!");
      setPriceEth("");
      setMetadataURI("");
    } catch (err) {
      console.error("Listing failed:", err);
      toast.error("Listing failed. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="list-device-container">
      <h3 className="list-device-title">List Device Data for Sale</h3>
      {error && <p className="error-text">{error}</p>}

      <label className="input-label">
        Select Device:
        <select
          value={selectedDeviceId}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          disabled={loading}
          className="select-input"
        >
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.name} ({device.deviceId})
            </option>
          ))}
        </select>
      </label>

      <label className="input-label">
        Price (ETH):
        <input
          type="text"
          value={priceEth}
          onChange={(e) => setPriceEth(e.target.value)}
          disabled={loading}
          placeholder="e.g., 0.01"
          className="text-input"
        />
      </label>

      <label className="input-label">
        Metadata URI (optional):
        <input
          type="text"
          value={metadataURI}
          onChange={(e) => setMetadataURI(e.target.value)}
          disabled={loading}
          placeholder="https://..."
          className="text-input"
        />
      </label>

      <button
        onClick={handleList}
        disabled={loading}
        className="list-button"
      >
        {loading ? "Listing..." : "List Device Data"}
      </button>
    </div>
  );
}
