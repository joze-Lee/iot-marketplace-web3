import React, { useState } from "react";
import { ethers } from "ethers";
import { DEVICE_REGISTRY_ADDRESS, DEVICE_REGISTRY_ABI } from "../constants";
import { toast } from "react-toastify";
import "./RegisterDevice.css";

export default function RegisterDevice({ provider, onRegistered }) {
  const [form, setForm] = useState({
    deviceId: "",
    deviceName: "",
    location: "",
    metadataURI: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const register = async () => {
    let { deviceId, deviceName: name, location, metadataURI } = form;
    deviceId = deviceId.trim();
    name = name.trim();
    location = location.trim();
    metadataURI = metadataURI.trim();

    if (!deviceId || !name || !location) {
      return toast.error("Device ID, Name, and Location are required");
    }

    try {
      setLoading(true);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(DEVICE_REGISTRY_ADDRESS, DEVICE_REGISTRY_ABI, signer);

      const tx = await contract.registerDevice(deviceId, name, location, metadataURI);
      await tx.wait();

      toast.success("Device registered successfully!");
      setForm({ deviceId: "", deviceName: "", location: "", metadataURI: "" });
      onRegistered();
    } catch (err) {
      console.error("Registration failed:", err);
      toast.error("Registration failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h3 className="register-title">Register New Device</h3>
      <input
        className="register-input"
        type="text"
        name="deviceId"
        placeholder="Device ID"
        value={form.deviceId}
        onChange={handleChange}
        disabled={loading}
      />
      <input
        className="register-input"
        type="text"
        name="deviceName"
        placeholder="Device Name"
        value={form.deviceName}
        onChange={handleChange}
        disabled={loading}
      />
      <input
        className="register-input"
        type="text"
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
        disabled={loading}
      />
      <input
        className="register-input"
        type="text"
        name="metadataURI"
        placeholder="Metadata URI (optional)"
        value={form.metadataURI}
        onChange={handleChange}
        disabled={loading}
      />
      <button
        className="register-button"
        onClick={register}
        disabled={loading}
      >
        {loading ? "Registering..." : "Register Device"}
      </button>
    </div>
  );
}
