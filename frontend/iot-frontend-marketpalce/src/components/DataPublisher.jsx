import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { DATA_PUBLISHER_ADDRESS, DATA_PUBLISHER_ABI } from "../constants";
import { toast } from "react-toastify";
import "./DataPublisher.css";

export default function DataPublisher({ provider, account, devices }) {
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [publishedData, setPublishedData] = useState([]);

  useEffect(() => {
    if (!provider || !account) return;

    // Placeholder for data fetching logic
    // TODO: Fetch and set published data
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

      // TODO: Replace with actual contract call
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
    <div className="data-publisher-container">
      <h3 className="data-publisher-title">Publish IoT Data</h3>

      <label className="input-label">
        Select Device:
        <select
          className="select-input"
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

      {/* TODO: Add list of published data below */}
    </div>
  );
}
