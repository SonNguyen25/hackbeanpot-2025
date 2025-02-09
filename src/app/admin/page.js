"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPage() {
  const [rewards, setRewards] = useState([]);
  const [editingReward, setEditingReward] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedOwner, setEditedOwner] = useState("");
  const [editedQuantity, setEditedQuantity] = useState(1);
  const router = useRouter();

  // Load rewards from localStorage when the component mounts.
  useEffect(() => {
    const storedRewards = localStorage.getItem("rewards");
    if (storedRewards) {
      setRewards(JSON.parse(storedRewards));
    }
  }, []);

  // Save rewards to localStorage and update the state.
  const saveRewards = (newRewards) => {
    localStorage.setItem("rewards", JSON.stringify(newRewards));
    setRewards(newRewards);
  };

  // Delete a reward by filtering it out of the rewards array.
  const handleDelete = (id) => {
    const newRewards = rewards.filter(
      (r) => r.id.toString() !== id.toString()
    );
    saveRewards(newRewards);
  };

  // Set up the edit form with the current values of the reward.
  const handleEdit = (reward) => {
    setEditingReward(reward);
    setEditedTitle(reward.title);
    setEditedDescription(reward.description);
    setEditedOwner(reward.owner);
    setEditedQuantity(reward.quantity);
  };

  // Save the edited reward.
  const handleSaveEdit = () => {
    const newRewards = rewards.map((r) => {
      if (r.id.toString() === editingReward.id.toString()) {
        return {
          ...r,
          title: editedTitle,
          description: editedDescription,
          owner: editedOwner,
          quantity: Number(editedQuantity),
        };
      }
      return r;
    });
    saveRewards(newRewards);
    setEditingReward(null);
  };

  // Cancel editing.
  const handleCancelEdit = () => {
    setEditingReward(null);
  };

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.headerTitle}>Admin Panel</h1>
      <Link href="/rewards" style={styles.backButton}>
        Back to Rewards
      </Link>
      <div style={styles.rewardsContainer}>
        {rewards.map((reward) => (
          <div key={reward.id} style={styles.rewardItem}>
            <div>
              <strong>Title:</strong> {reward.title}
              <br />
              <strong>Description:</strong> {reward.description}
              <br />
              <strong>Owner:</strong> {reward.owner}
              <br />
              <strong>Quantity:</strong> {reward.quantity}
            </div>
            <div style={styles.buttonContainer}>
              <button
                style={styles.editButton}
                onClick={() => handleEdit(reward)}
              >
                Edit
              </button>
              <button
                style={styles.deleteButton}
                onClick={() => handleDelete(reward.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {editingReward && (
        <div style={styles.editForm}>
          <h2>Edit Reward</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>Title:</label>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Description:</label>
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              style={styles.textarea}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Owner:</label>
            <input
              type="text"
              value={editedOwner}
              onChange={(e) => setEditedOwner(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Quantity:</label>
            <input
              type="number"
              value={editedQuantity}
              onChange={(e) => setEditedQuantity(e.target.value)}
              style={styles.input}
              min="1"
            />
          </div>
          <div style={styles.buttonContainer}>
            <button style={styles.saveButton} onClick={handleSaveEdit}>
              Save
            </button>
            <button style={styles.cancelButton} onClick={handleCancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  pageContainer: {
    backgroundColor: "#000",
    minHeight: "100vh",
    padding: "20px",
    color: "#0f0",
  },
  headerTitle: {
    fontSize: "48px",
    marginBottom: "20px",
  },
  backButton: {
    display: "inline-block",
    marginBottom: "20px",
    padding: "10px 20px",
    backgroundColor: "#0f0",
    color: "#000",
    textDecoration: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    fontSize: "18px",
  },
  rewardsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  rewardItem: {
    backgroundColor: "#90EE90",
    color: "#000",
    padding: "15px",
    borderRadius: "10px",
    border: "2px solid #0f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
  },
  editButton: {
    padding: "8px 12px",
    backgroundColor: "#0f0",
    color: "#000",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "8px 12px",
    backgroundColor: "#f00",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  editForm: {
    marginTop: "30px",
    backgroundColor: "#222",
    padding: "20px",
    borderRadius: "10px",
    border: "2px solid #0f0",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    fontSize: "18px",
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "2px solid #0f0",
    backgroundColor: "#000",
    color: "#0f0",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "2px solid #0f0",
    backgroundColor: "#000",
    color: "#0f0",
    minHeight: "80px",
  },
  saveButton: {
    padding: "10px 20px",
    backgroundColor: "#0f0",
    color: "#000",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#f00",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

