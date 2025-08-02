// src/components/DeviceList.jsx
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { DEVICE_REGISTRY_ADDRESS, DEVICE_REGISTRY_ABI } from "../constants";
import { toast } from "react-toastify";

export default function DeviceList({ provider, account, refreshFlag, onDevicesUpdated }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!provider) return;

    const contract = new ethers.Contract(
      DEVICE_REGISTRY_ADDRESS,
      DEVICE_REGISTRY_ABI,
      provider
    );

    async function fetchPastDevices() {
      try {
        setLoading(true);
        setError(null);

        const filter = contract.filters.DeviceRegistered();
        const events = await contract.queryFilter(filter, 0, "latest");

        const pastDevices = events.map((event) => {
          const [deviceId, name, location, owner, metadataURI, registeredAt] = event.args;
          return {
            deviceId: deviceId.toString(),
            name,
            location,
            owner: owner.toLowerCase(),
            metadataURI,
            registeredAt: new Date(registeredAt.toNumber() * 1000).toLocaleString(),
          };
        });

        // Filter devices owned by the current account (case insensitive)
        const filtered = account
          ? pastDevices.filter(d => d.owner === account.toLowerCase())
          : [];

        setDevices(filtered);

        // Lift devices state up to parent if callback provided
        if (typeof onDevicesUpdated === "function") {
          onDevicesUpdated(filtered);
        }

      } catch (err) {
        console.error("Failed to fetch past devices:", err);
        setError("Failed to load devices");
        toast.error("Failed to load devices");
      } finally {
        setLoading(false);
      }
    }

    fetchPastDevices();
  }, [provider, refreshFlag, account, onDevicesUpdated]);

  return (
    <div>
      <h2>Your Registered Devices</h2>
      {loading && <p>Loading devices...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && devices.length === 0 && <p>You have no registered devices.</p>}

      {devices.length > 0 && (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Device ID</th>
              <th>Name</th>
              <th>Location</th>
              <th>Metadata URI</th>
              <th>Registered At</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.deviceId}>
                <td>{device.deviceId}</td>
                <td>{device.name}</td>
                <td>{device.location}</td>
                <td>{device.metadataURI || "-"}</td>
                <td>{device.registeredAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
