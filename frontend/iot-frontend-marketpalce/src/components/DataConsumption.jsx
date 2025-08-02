import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { MARKETPLACE_ADDRESS, MARKETPLACE_ABI } from "../constants";

export default function DataConsumption({ provider, account }) {
  const [purchasedData, setPurchasedData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!provider || !account) return;

    async function loadPurchasedData() {
      setLoading(true);
      try {
        const contract = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, provider);

        // Get all purchased events where msg.sender is the buyer
        const purchasedEvents = await contract.queryFilter(contract.filters.DataPurchased());

        // Filter only those bought by this account
        const myPurchases = purchasedEvents.filter(
          (e) => e.args.buyer.toLowerCase() === account.toLowerCase()
        );

        // For each purchase, get the dataHash via contract call
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

  if (loading) return <p>Loading your purchased data...</p>;
  if (purchasedData.length === 0) return <p>You have no purchased data items.</p>;

  return (
    <div>
      <h2>Your Purchased Data</h2>
      <ul>
        {purchasedData.map(({ dataId, dataHash }) => (
          <li key={dataId}>
            <strong>Data ID:</strong> {dataId} <br />
            <strong>Data Hash:</strong> {dataHash}
          </li>
        ))}
      </ul>
    </div>
  );
}
