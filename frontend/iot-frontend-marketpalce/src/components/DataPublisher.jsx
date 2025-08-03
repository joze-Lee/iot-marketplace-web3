import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { DATA_PUBLISHER_ADDRESS, DATA_PUBLISHER_ABI } from "../constants";
import { toast } from "react-toastify";
import "./DataPublisher.css";

export default function DataPublisher({ provider, account, devices }) {
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [description, setDescription] = useState("");
  const [dataHash, setDataHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [publishedData, setPublishedData] = useState([]);

  useEffect(() => {
    if (!provider || !account) return;

    
    const contract = new ethers.Contract(
      DATA_PUBLISHER_ADDRESS,
      DATA_PUBLISHER_ABI,
      provider
    );

    async function fetchPublishedData() {
      try {
        const dataIds = await contract.getMyPublishedData();
        const entries = await Promise.all(
          dataIds.map(async (id) => {
            const entry = await contract.getDataEntry(id);
            return {
              id: entry.id.toString(),
              dataHash: entry.dataHash,
              description: entry.description,
              deviceId: entry.deviceId,
              timestamp: Number(entry.timestamp)
            };
          })
        );

        // Sort by timestamp descending (latest first)
        const sortedEntries = entries.sort((a, b) => b.timestamp - a.timestamp);
        setPublishedData(sortedEntries);
      } catch (err) {
        console.error("Failed to fetch published data:", err);
        toast.error("Could not load your published data");
      }
    }

    fetchPublishedData();
  }, [provider, account]);

  useEffect(() => {
    if (devices.length > 0) {
      setSelectedDeviceId(devices[0].deviceId);
    }
  }, [devices]);

  const publishData = async () => {
    if (!selectedDeviceId) return toast.error("Select a device first.");
    if (!description.trim()) return toast.error("Description cannot be empty.");
    if (!dataHash.trim()) return toast.error("Data hash cannot be empty.");

    try {
      setLoading(true);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        DATA_PUBLISHER_ADDRESS,
        DATA_PUBLISHER_ABI,
        signer
      );

      const tx = await contract.publishData(dataHash, description, selectedDeviceId);
      await tx.wait();

      toast.success("Data published successfully!");
      setDescription("");
      setDataHash("");

      // Refresh published data list
      const dataIds = await contract.getMyPublishedData();
      const newId = dataIds[dataIds.length - 1]; // last ID is the newest
      const newEntry = await contract.getDataEntry(newId);
      setPublishedData(prev => [
        {
          id: newEntry.id.toString(),
          dataHash: newEntry.dataHash,
          description: newEntry.description,
          deviceId: newEntry.deviceId,
          timestamp: Number(newEntry.timestamp)
        },
        ...prev
      ]);
    } catch (err) {
      console.error("Publish failed:", err);
      toast.error("Publishing data failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="data-publisher-container">
      <h3 className="data-publisher-title">Publish IoT Data</h3>

      <label className="input-label">
        Select Device:
        <select
          className="select-input"
          value={selectedDeviceId}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          disabled={loading || devices.length === 0}
        >
          {devices.length === 0 && <option value="">No devices found</option>}
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.name} ({device.deviceId})
            </option>
          ))}
        </select>
      </label>

      <label className="input-label">
        Data Hash:
        <input
          type="text"
          className="text-input"
          placeholder="Enter data hash (e.g., IPFS hash)"
          value={dataHash}
          onChange={(e) => setDataHash(e.target.value)}
          disabled={loading}
        />
      </label>

      <label className="input-label">
        Data Description:
        <textarea
          className="text-area"
          placeholder="Enter data description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          rows={4}
        />
      </label>

      <button
        className="publish-button"
        onClick={publishData}
        disabled={loading}
      >
        {loading ? "Publishing..." : "Publish Data"}
      </button>

      {/* Published data listing */}
      {publishedData.length > 0 && (
        <div className="published-data-list">
          <h4>Your Published Data</h4>
          <ul>
            {publishedData.map((data) => (
              <li key={data.id} className="published-data-item">
                <p><strong>ID:</strong> {data.id}</p>
                <p><strong>Device ID:</strong> {data.deviceId}</p>
                <p><strong>Data Hash:</strong> {data.dataHash}</p>
                <p><strong>Description:</strong> {data.description}</p>
                <p><strong>Timestamp:</strong> {new Date(data.timestamp * 1000).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
