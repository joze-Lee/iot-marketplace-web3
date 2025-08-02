import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { DATA_PUBLISHER_ADDRESS, DATA_PUBLISHER_ABI } from "../constants";
import "./AllDataList.css";

export default function AllDataList({ provider }) {
  const [dataEntries, setDataEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!provider) return;

    async function fetchAllData() {
      setLoading(true);
      try {
        const contract = new ethers.Contract(DATA_PUBLISHER_ADDRESS, DATA_PUBLISHER_ABI, provider);

        // TODO: Replace 0 with actual total count
        const totalCount = 0;

        const entries = [];
        for (let i = 0; i < totalCount; i++) {
          const data = await contract.getDataEntry(i);
          entries.push({
            id: data.id.toString(),
            publisher: data.publisher,
            dataHash: data.dataHash,
            description: data.description,
            timestamp: new Date(data.timestamp.toNumber() * 1000).toLocaleString(),
            isAvailable: data.isAvailable,
          });
        }

        setDataEntries(entries);
      } catch (err) {
        console.error("Error fetching all data entries:", err);
      }
      setLoading(false);
    }

    fetchAllData();
  }, [provider]);

  return (
    <div className="all-data-container">
      <h2 className="section-title">All Data Entries</h2>

      {loading ? (
        <p className="info-text">Loading all data entries...</p>
      ) : dataEntries.length === 0 ? (
        <p className="info-text">No data entries found.</p>
      ) : (
        <ul className="data-list">
          {dataEntries.map(entry => (
            <li key={entry.id} className="data-item">
              <p><strong>ID:</strong> {entry.id}</p>
              <p><strong>Description:</strong> {entry.description}</p>
              <p><strong>Publisher:</strong> {entry.publisher}</p>
              <p><strong>Timestamp:</strong> {entry.timestamp}</p>
              <p><strong>Available:</strong> {entry.isAvailable ? "Yes" : "No"}</p>
              <p><strong>Data Hash:</strong> {entry.dataHash}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
