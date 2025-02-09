"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";

export default function CreateReward() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [owner, setOwner] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState(null);
  const router = useRouter();

  // Handle image upload and compression
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Set options for compression (adjust as needed)
      const options = {
        maxSizeMB: 0.5,         // Compress to 0.5 MB max
        maxWidthOrHeight: 800,    // Resize if larger than 800px in either dimension
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const newReward = {
      id: Date.now(), // Unique id based on current timestamp
      title,
      description,
      owner,
      quantity: Number(quantity),
      image, // Base64 image string (if available)
    };

    // Retrieve existing rewards from localStorage
    const storedRewards = localStorage.getItem("rewards");
    const rewards = storedRewards ? JSON.parse(storedRewards) : [];
    rewards.push(newReward);

    // Try to save the rewards to localStorage
    try {
      localStorage.setItem("rewards", JSON.stringify(rewards));
    } catch (error) {
      console.error("Error saving reward:", error);
      alert(
        "Unable to save reward: Storage quota exceeded. Please try uploading a smaller image or remove some rewards."
      );
      return;
    }

    // Navigate back to the rewards list page
    router.push("/rewards");
  };

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.heading}>Create Reward</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Owner:</label>
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            style={styles.input}
            placeholder="e.g., Coffee House, Gas Station"
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={styles.input}
            min="1"
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Upload Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.inputFile}
          />
          {image && (
            <img
              src={image}
              alt="Reward Preview"
              style={styles.imagePreview}
            />
          )}
        </div>

        <button type="submit" style={styles.submitButton}>
          Create Reward
        </button>
      </form>
    </div>
  );
}

const styles = {
  pageContainer: {
    backgroundColor: "#000", // Black background
    minHeight: "100vh",
    color: "#fff", // Default text white
    padding: "20px",
  },
  heading: {
    textAlign: "center",
    fontSize: "56px",
    marginBottom: "20px",
    color: "#1db954", // Green accent for heading
  },
  form: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "10px",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#fff",
  },
  input: {
    width: "100%",
    padding: "15px",
    borderRadius: "5px",
    border: "2px solid #1db954", // Green border
    backgroundColor: "#222",
    color: "#fff",
    fontSize: "18px",
  },
  inputFile: {
    fontSize: "18px",
    color: "#fff",
  },
  textarea: {
    width: "100%",
    padding: "15px",
    borderRadius: "5px",
    border: "2px solid #1db954",
    backgroundColor: "#222",
    color: "#fff",
    fontSize: "18px",
    minHeight: "120px",
  },
  imagePreview: {
    marginTop: "10px",
    maxWidth: "200px",
    maxHeight: "200px",
    borderRadius: "5px",
    border: "2px solid #1db954",
    display: "block",
  },
  submitButton: {
    display: "block",
    width: "100%",
    padding: "15px",
    backgroundColor: "#1db954",
    color: "#000",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    fontSize: "20px",
    cursor: "pointer",
  },
};

