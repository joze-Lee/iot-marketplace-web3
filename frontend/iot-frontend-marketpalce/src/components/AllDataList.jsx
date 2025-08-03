import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { DATA_PUBLISHER_ADDRESS, DATA_PUBLISHER_ABI } from "../constants";
import "./AllDataList.css";

const BATCH_SIZE = 5; // Number of parallel requests per batch, tweak as needed

export default function AllDataList({ provider }) {
  const [dataEntries, setDataEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!provider) return;

    async function fetchAllData() {
      setLoading(true);
      setError(null);
      try {
        const contract = new ethers.Contract(DATA_PUBLISHER_ADDRESS, DATA_PUBLISHER_ABI, provider);

        const totalCount = await contract.getDataCount();
        const entries = [];

        for (let i = 0; i < totalCount; i += BATCH_SIZE) {
          // Create batch calls for current chunk
          const batchCalls = [];
          const limit = Math.min(BATCH_SIZE, totalCount - i);
          for (let j = 0; j < limit; j++) {
            batchCalls.push(contract.getDataEntry(i + j));
          }

          // Await batch results in parallel
          const batchResults = await Promise.all(batchCalls);

          // Process and store each entry
          batchResults.forEach((data) => {
            entries.push({
              id: data.id.toString(),
              publisher: data.publisher,
              dataHash: data.dataHash,
              description: data.description,
              timestamp: new Date(data.timestamp.toNumber() * 1000).toLocaleString(),
              isAvailable: data.isAvailable,
            });
          });
        }

        setDataEntries(entries);
      } catch (err) {
        console.error("Error fetching all data entries:", err);
        setError("Failed to fetch data entries. Please try again later.");
      }
      setLoading(false);
    }

    fetchAllData();
  }, [provider]);

  return (
    <div className="all-data-container">
      <h2 className="section-title">All Data Entries</h2>

      {loading && <p className="info-text">Loading all data entries...</p>}

      {error && <p className="error-text">{error}</p>}

      {!loading && !error && dataEntries.length === 0 && (
        <p className="info-text">No data entries found.</p>
      )}

      {!loading && !error && dataEntries.length > 0 && (
        <ul className="data-list">
          {dataEntries.map((entry) => (
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
