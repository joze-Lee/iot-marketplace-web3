import React, { useEffect, useState } from "react";
// import { ethers } from "ethers";
import {  formatEther, parseEther } from "ethers";
import { MARKETPLACE_ADDRESS, MARKETPLACE_ABI } from "../constants";
import "./MarketplaceListings.css";

export default function MarketplaceListings({ provider, account }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buyingDataId, setBuyingDataId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!provider) return;
    loadListings();
  }, [provider]);

  async function loadListings() {
    setLoading(true);
    setError(null);
    try {
      const contract = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, provider);
      const allListings = await contract.getAllListings();

      const activeListings = allListings
        .filter(listing => !listing.isSold)
        .map(listing => ({
          dataId: listing.dataId.toString(),
          publisher: listing.publisher,
          price: formatEther(listing.price),
        }));

      setListings(activeListings);
    } catch (error) {
      console.error("Failed to load marketplace listings:", error);
      setError("Failed to load marketplace listings. Please try again later.");
    }
    setLoading(false);
  }

  async function handleBuy(dataId, price) {
    if (!provider || !account) {
      alert("Connect your wallet first");
      return;
    }
    try {
      setBuyingDataId(dataId);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, signer);

      const tx = await contract.buyData(dataId, { value: parseEther(price) });
      await tx.wait();

      alert(`Successfully purchased data ${dataId}!`);
      await loadListings();
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("Purchase failed: " + (error.data?.message || error.message));
    } finally {
      setBuyingDataId(null);
    }
  }

  if (loading) return <p className="loading-text">Loading listings...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (listings.length === 0) return <p className="no-listings-text">No active listings.</p>;

  return (
    <div className="marketplace-container">
      <h2 className="marketplace-title">Marketplace Listings</h2>
      <ul className="marketplace-list">
        {listings.map(listing => (
          <li key={listing.dataId} className="marketplace-item">
            <div>
              <strong>Data ID:</strong> {listing.dataId} <br />
              <strong>Price:</strong> {listing.price} ETH <br />
              <strong>Publisher:</strong> {listing.publisher} <br />
            </div>
            <button
              className="buy-button"
              onClick={() => handleBuy(listing.dataId, listing.price)}
              disabled={buyingDataId === listing.dataId}
            >
              {buyingDataId === listing.dataId ? "Buying..." : "Buy"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
