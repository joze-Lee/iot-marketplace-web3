import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { MARKETPLACE_ADDRESS, MARKETPLACE_ABI } from "../constants";
import "./DataConsumption.css";

export default function DataConsumption({ provider, account }) {
  const [purchasedData, setPurchasedData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!provider || !account) return;

    async function loadPurchasedData() {
      setLoading(true);
      try {
        const contract = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, provider);
        const purchasedEvents = await contract.queryFilter(contract.filters.DataPurchased());

        const myPurchases = purchasedEvents.filter(
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
        setPurchasedData([]);
      }
      setLoading(false);
    }

    loadPurchasedData();
  }, [provider, account]);

  return (
    <div className="data-consumption-container">
      <h2 className="section-title">Your Purchased Data</h2>

      {loading ? (
        <p className="info-text">Loading your purchased data...</p>
      ) : purchasedData.length === 0 ? (
        <p className="info-text">You have no purchased data items.</p>
      ) : (
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
