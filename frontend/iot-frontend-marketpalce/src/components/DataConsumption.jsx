import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { MARKETPLACE_ADDRESS, MARKETPLACE_ABI } from "../constants";
import "./DataConsumption.css";

const BLOCK_STEP = 10000;

export default function DataConsumption({ provider, account }) {
  const [purchasedData, setPurchasedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!provider || !account) return;

    async function loadPurchasedData() {
      setLoading(true);
      setError(null);
      try {
        const contract = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, provider);
        const latestBlock = await provider.getBlockNumber();

        let allEvents = [];
        for (let start = 0; start <= latestBlock; start += BLOCK_STEP) {
          const end = Math.min(start + BLOCK_STEP - 1, latestBlock);
          const events = await contract.queryFilter(
            contract.filters.DataPurchased(),
            start,
            end
          );
          allEvents = allEvents.concat(events);
        }

        const myPurchases = allEvents.filter(
          (e) => e.args.buyer.toLowerCase() === account.toLowerCase()
        );

        const purchasedDataDetails = await Promise.all(
          myPurchases.map(async (e) => {
            const dataId = e.args.dataId.toString();
            const dataHash = await contract.getDataHash(dataId);
            return { dataId, dataHash };
          })
        );

        setPurchasedData(purchasedDataDetails);
      } catch (error) {
        console.error("Failed to load purchased data:", error);
        setError("Failed to load purchased data, please try again later.");
        setPurchasedData([]);
      }
      setLoading(false);
    }

    loadPurchasedData();
  }, [provider, account]);

  return (
    <div className="data-consumption-container">
      <h2 className="section-title">Your Purchased Data</h2>

      {loading && <p className="info-text">Loading your purchased data...</p>}

      {error && <p className="error-text">{error}</p>}

      {!loading && !error && purchasedData.length === 0 && (
        <p className="info-text">You have no purchased data items.</p>
      )}

      {!loading && !error && purchasedData.length > 0 && (
        <ul className="data-list">
          {purchasedData.map(({ dataId, dataHash }) => (
            <li key={dataId} className="data-item">
              <span><strong>Data ID:</strong> {dataId}</span>
              <span><strong>Data Hash:</strong> {dataHash}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
