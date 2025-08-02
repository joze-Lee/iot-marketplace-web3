// src/components/ListDeviceForSale.jsx
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { MARKETPLACE_ADDRESS, MARKETPLACE_ABI, DEVICE_REGISTRY_ADDRESS, DEVICE_REGISTRY_ABI } from "../constants";

export default function ListDeviceForSale({ provider, account }) {
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [priceEth, setPriceEth] = useState("");
  const [metadataURI, setMetadataURI] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!provider || !account) return;

    const contract = new ethers.Contract(DEVICE_REGISTRY_ADDRESS, DEVICE_REGISTRY_ABI, provider);

    async function fetchUserDevices() {
      try {
        const filter = contract.filters.DeviceRegistered(null,  account);
        const events = await contract.queryFilter(filter, 0, "latest");

        const userDevices = events.map(event => {
          const [deviceId, name] = event.args;
          return { deviceId: deviceId.toString(), name };
        });

        setDevices(userDevices);
        if (userDevices.length > 0) setSelectedDeviceId(userDevices[0].deviceId);
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

    try {
      setLoading(true);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, signer);
      const priceWei = ethers.utils.parseEther(priceEth);

      const tx = await contract.listItem(selectedDeviceId, priceWei, metadataURI);
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
    <div>
      <h3>List Device Data for Sale</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label>
        Select Device: <br />
        <select
          value={selectedDeviceId}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          disabled={loading}
        >
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.name} ({device.deviceId})
            </option>
          ))}
        </select>
      </label>
      <br /><br />

      <label>
        Price (ETH): <br />
        <input
          type="number"
          value={priceEth}
          onChange={(e) => setPriceEth(e.target.value)}
          disabled={loading}
          placeholder="e.g., 0.01"
          min="0"
          step="0.0001"
        />
      </label>
      <br /><br />

      <label>
        Metadata URI (optional): <br />
        <input
          type="text"
          value={metadataURI}
          onChange={(e) => setMetadataURI(e.target.value)}
          disabled={loading}
          placeholder="https://..."
        />
      </label>
      <br /><br />

      <button onClick={handleList} disabled={loading}>
        {loading ? "Listing..." : "List Device Data"}
      </button>
    </div>
  );
}
