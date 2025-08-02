import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { DATA_PUBLISHER_ADDRESS, DATA_PUBLISHER_ABI } from "../constants";

export default function AllDataList({ provider }) {
  const [dataEntries, setDataEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!provider) return;

    async function fetchAllData() {
      setLoading(true);
      try {
        const contract = new ethers.Contract(DATA_PUBLISHER_ADDRESS, DATA_PUBLISHER_ABI, provider);

        // Assuming your DataPublisher contract has a method to get total data count
        const totalCount = await contract.getDataCount(); // You might need to add this method if missing
        // const totalCount = 0
        
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

  if (loading) return <p>Loading all data entries...</p>;
  if (dataEntries.length === 0) return <p>No data entries found.</p>;

  return (
    <div>
      <h2>All Data Entries</h2>
      <ul>
        {dataEntries.map(entry => (
          <li key={entry.id}>
            <strong>ID:</strong> {entry.id} <br />
            <strong>Description:</strong> {entry.description} <br />
            <strong>Publisher:</strong> {entry.publisher} <br />
            <strong>Timestamp:</strong> {entry.timestamp} <br />
            <strong>Available:</strong> {entry.isAvailable ? "Yes" : "No"} <br />
            <strong>Data Hash:</strong> {entry.dataHash}
          </li>
        ))}
      </ul>
    </div>
  );
}
