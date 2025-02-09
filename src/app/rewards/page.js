"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RewardsList() {
  const [rewards, setRewards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedRewards = localStorage.getItem("rewards");
    if (storedRewards) {
      setRewards(JSON.parse(storedRewards));
    } else {
      // Optional fallback data if needed
      setRewards([]);
    }
  }, []);

  return (
    <div style={styles.pageContainer}>
      {/* Navigation Header */}
      <div style={styles.navHeader}>
        <h1 style={styles.headerTitle}>Rewards</h1>
        <Link href="/rewards/create" style={styles.createButton}>
          Create Reward
        </Link>
      </div>

      {/* Three-Column Grid */}
      <div style={styles.gridContainer}>
        {rewards.map((reward) => (
          <div
            key={reward.id}
            style={styles.rewardCard}
            onClick={() => router.push(`/rewards/claim/${reward.id}`)}
          >
            {/* Top Half: Details */}
            <div style={styles.detailsSection}>
              <h2 style={styles.rewardTitle}>{reward.title}</h2>
              <p style={styles.rewardDescription}>{reward.description}</p>
              <p style={styles.ownerLabel}>Owner: {reward.owner}</p>
              <p style={styles.quantityLabel}>Qty: {reward.quantity}</p>
            </div>

            {/* Bottom Half: Image */}
            <div style={styles.imageSection}>
              {reward.image && (
                <img
                  src={reward.image}
                  alt={reward.title}
                  style={styles.rewardImage}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    backgroundColor: "#000", // Black background
    minHeight: "100vh",
    color: "#fff",
    padding: "20px",
  },
  navHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    borderBottom: "2px solid #0f0",
    marginBottom: "20px",
  },
  headerTitle: {
    fontSize: "48px",
    margin: 0,
  },
  createButton: {
    padding: "10px 20px",
    backgroundColor: "#0f0", // Bright green button
    color: "#000",
    textDecoration: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    fontSize: "18px",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", // Three columns
    gap: "20px",
  },
  rewardCard: {
    backgroundColor: "#90EE90", // Light green background
    color: "#000", // Dark text for readability
    borderRadius: "10px",
    border: "2px solid #0f0",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    aspectRatio: "1 / 1", // Force a square shape
    overflow: "hidden",
  },
  detailsSection: {
    padding: "10px",
    flex: "1 1 50%", // Top half of the card
  },
  imageSection: {
    flex: "1 1 50%", // Bottom half of the card
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#90EE90", // Same light green as card background
  },
  rewardTitle: {
    fontSize: "24px",
    margin: "0 0 5px 0",
  },
  rewardDescription: {
    fontSize: "16px",
    margin: "0 0 5px 0",
  },
  ownerLabel: {
    fontSize: "14px",
    margin: "0 0 5px 0",
  },
  quantityLabel: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  rewardImage: {
    maxWidth: "100%",       // Do not exceed container's width
    maxHeight: "100%",      // Do not exceed container's height
    objectFit: "contain",   // Scale image down as necessary without cutting it off
    display: "block",
    margin: "0 auto",       // Center the image horizontally
  },
};

