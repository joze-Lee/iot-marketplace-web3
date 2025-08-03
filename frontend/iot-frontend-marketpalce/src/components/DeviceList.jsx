import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { DEVICE_REGISTRY_ADDRESS, DEVICE_REGISTRY_ABI } from "../constants";
import { toast } from "react-toastify";
import "./DeviceList.css";

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
          console.log("Event args:", event.args);
          const [deviceId, name, location, owner, metadataURI] = event.args;
          return {
            deviceId: deviceId.toString(),
            name,
            location,
            owner: owner.toLowerCase(),
            metadataURI,
            // registeredAt: new Date(registeredAt.toNumber() * 1000).toLocaleString(),
            registeredAt:new Date().toLocaleString()
          };
        });

        const filtered = account
          ? pastDevices.filter(d => d.owner === account.toLowerCase())
          : [];

        setDevices(filtered);

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
    <div className="device-list-container">
      <h2 className="device-list-title">Your Registered Devices</h2>
      {loading && <p className="info-text">Loading devices...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && devices.length === 0 && (
        <p className="info-text">You have no registered devices.</p>
      )}

      {devices.length > 0 && (
        <div className="table-wrapper">
          <table className="device-table">
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
        </div>
      )}
    </div>
  );
}
