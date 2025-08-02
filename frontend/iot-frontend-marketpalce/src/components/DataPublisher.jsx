// src/components/DataPublisher.jsx
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { DATA_PUBLISHER_ADDRESS, DATA_PUBLISHER_ABI } from "../constants";
import { toast } from "react-toastify";

export default function DataPublisher({ provider, account, devices }) {
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [publishedData, setPublishedData] = useState([]);

  useEffect(() => {
    if (!provider || !account) return;

    // Fetch user's published data by scanning dataIds, placeholder logic for now
    // TODO: Implement contract calls to fetch user's data

  }, [provider, account]);

  const publishData = async () => {
    if (!selectedDeviceId) {
      return toast.error("Select a device first.");
    }
    if (!description) {
      return toast.error("Description cannot be empty.");
    }

    try {
      setLoading(true);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(DATA_PUBLISHER_ADDRESS, DATA_PUBLISHER_ABI, signer);

      // TODO: Replace with actual contract call to publish data
      // const tx = await contract.publishData(selectedDeviceId, description);
      // await tx.wait();

      toast.success("Data published successfully!");
      setDescription("");
    } catch (err) {
      console.error("Publish failed:", err);
      toast.error("Publishing data failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Publish Data</h3>

      <label>
        Select Device:
        <select
          value={selectedDeviceId}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          disabled={loading}
        >
          <option value="">-- Select Device --</option>
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.name} ({device.deviceId})
            </option>
          ))}
        </select>
      </label>

      <br />
      <textarea
        placeholder="Data description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={loading}
        rows={4}
        cols={40}
      />

      <br />
      <button onClick={publishData} disabled={loading}>
        {loading ? "Publishing..." : "Publish Data"}
      </button>

      {/* TODO: List of published data below */}
    </div>
  );
}
