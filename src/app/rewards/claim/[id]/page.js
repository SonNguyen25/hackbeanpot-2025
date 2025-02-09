"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import QRCode from "react-qr-code";

export default function ClaimRewardPage() {
  const { id } = useParams();
  const router = useRouter();
  const [reward, setReward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrValue, setQrValue] = useState(null);

  useEffect(() => {
    if (id) {
      const storedRewards = localStorage.getItem("rewards");
      const rewards = storedRewards ? JSON.parse(storedRewards) : [];
      const foundReward = rewards.find((r) => r.id.toString() === id);
      setReward(foundReward);
      setLoading(false);
    }
  }, [id]);

  const handleClaim = () => {
    const storedRewards = localStorage.getItem("rewards");
    let rewards = storedRewards ? JSON.parse(storedRewards) : [];
    const rewardIndex = rewards.findIndex((r) => r.id.toString() === id);
    if (rewardIndex > -1) {
      if (rewards[rewardIndex].quantity > 1) {
        rewards[rewardIndex].quantity -= 1;
      } else {
        rewards = rewards.filter((r) => r.id.toString() !== id);
      }
      localStorage.setItem("rewards", JSON.stringify(rewards));
    }
    // Generate a random code for the QR code
    const randomCode = Math.random().toString(36).substring(2, 10);
    setQrValue(randomCode);
  };

  if (loading) {
    return <div style={styles.pageContainer}>Loading...</div>;
  }

  if (!reward) {
    return (
      <div style={styles.pageContainer}>
        Reward not found or fully claimed.
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.heading}>Claim Reward</h1>
      <div style={styles.rewardCard}>
        <div style={styles.cardContent}>
          <div style={styles.textSection}>
            <h2 style={styles.rewardTitle}>{reward.title}</h2>
            <p style={styles.rewardDescription}>{reward.description}</p>
            <p style={styles.ownerLabel}>Owner: {reward.owner}</p>
            <p style={styles.quantityLabel}>
              Quantity Available: {reward.quantity}
            </p>
            {qrValue ? (
              <div style={styles.qrContainer}>
                <p style={styles.qrText}>Show this QR code at the store:</p>
                <QRCode value={qrValue} size={128} />
                <p style={styles.qrValue}>Code: {qrValue}</p>
                <button
                  onClick={() => router.push("/rewards")}
                  style={styles.doneButton}
                >
                  Done
                </button>
              </div>
            ) : (
              <button onClick={handleClaim} style={styles.claimButton}>
                Claim Reward
              </button>
            )}
          </div>
          {reward.image && (
            <div style={styles.imageSection}>
              <img
                src={reward.image}
                alt={reward.title}
                style={styles.rewardImage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    backgroundColor: "#000",
    minHeight: "100vh",
    color: "#0f0",
    padding: "20px",
  },
  heading: {
    textAlign: "center",
    fontSize: "48px",
    marginBottom: "20px",
  },
  rewardCard: {
    backgroundColor: "#90EE90",
    color: "#fff",
    padding: "40px",
    borderRadius: "10px",
    maxWidth: "800px",
    margin: "0 auto",
    border: "2px solid #0f0",
    boxSizing: "border-box",
  },
  cardContent: {
    display: "flex",
    flexDirection: "row",
  },
  textSection: {
    flex: 1,
    paddingRight: "20px",
  },
  imageSection: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  rewardTitle: {
    fontSize: "32px",
    margin: "0 0 10px 0",
  },
  rewardDescription: {
    fontSize: "20px",
    margin: "0 0 10px 0",
  },
  ownerLabel: {
    fontSize: "20px",
    margin: "0 0 10px 0",
  },
  quantityLabel: {
    fontSize: "20px",
    fontWeight: "bold",
    margin: "0 0 20px 0",
  },
  claimButton: {
    padding: "15px 30px",
    backgroundColor: "#0f0",
    color: "#000",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    fontSize: "20px",
    cursor: "pointer",
  },
  qrContainer: {
    textAlign: "center",
    marginTop: "20px",
  },
  qrText: {
    fontSize: "20px",
    marginBottom: "10px",
  },
  qrValue: {
    fontSize: "18px",
    marginTop: "10px",
  },
  doneButton: {
    marginTop: "20px",
    padding: "15px 30px",
    backgroundColor: "#0f0",
    color: "#000",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    fontSize: "20px",
    cursor: "pointer",
  },
  rewardImage: {
    maxWidth: "100%",
    maxHeight: "200px",
    objectFit: "cover",
    borderRadius: "5px",
  },
};
