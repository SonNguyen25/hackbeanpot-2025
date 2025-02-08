"use client";

import { useState, useEffect, useRef } from "react";

export default function VoiceEmotionPage() {
  // accessToken will be null if the user is not logged in.
  const [accessToken, setAccessToken] = useState(null);
  const [recording, setRecording] = useState(false);
  const [statusText, setStatusText] = useState("Please log in with Spotify.");
  const [result, setResult] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // On mount, check if there's an accessToken in the URL or in localStorage.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("accessToken");
    if (tokenFromUrl) {
      localStorage.setItem("spotifyAccessToken", tokenFromUrl);
      setAccessToken(tokenFromUrl);
      // Clean the URL so the token isn't visible.
      window.history.replaceState(null, "", window.location.pathname);
    } else {
      const storedToken = localStorage.getItem("spotifyAccessToken");
      if (storedToken) {
        setAccessToken(storedToken);
      }
    }
  }, []);

  // When the user clicks this button, they are redirected to your Flask login endpoint.
  const handleLogin = () => {
    const redirectUrl = encodeURIComponent(window.location.href);
    window.location.href = `http://localhost:8080/login?redirectUrl=${redirectUrl}`;
  };

  // Start recording using the browser's MediaRecorder API.
  const startRecording = async () => {
    setStatusText("Requesting microphone access...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setStatusText("Recording stopped. Processing...");
        // Combine the audio chunks into a Blob.
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.wav");

        try {
          // Send the recording to our Next.js API route, which forwards it to your Flask backend.
          const response = await fetch("/api/process_audio", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          });
          const data = await response.json();
          if (data.error) {
            setResult(<p style={{ color: "red" }}>⚠️ {data.error}</p>);
          } else {
            setResult(
              <div>
                <h3>🎭 Detected Emotion: {data.emotion}</h3>
                <h4>🎵 Song Recommendation:</h4>
                <p>
                  <strong>{data.matched_song.track_name}</strong> by {data.matched_song.artist}
                </p>
                <p>The recommended song has been added to your Spotify queue.</p>
              </div>
            );
          }
          setStatusText("Done!");
        } catch (error) {
          console.error("Error processing recording:", error);
          setStatusText("Error processing recording.");
        }
      };

      mediaRecorder.start();
      setRecording(true);
      setStatusText("Recording... Speak now!");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setStatusText("Error: Unable to access microphone.");
    }
  };

  // Stop recording.
  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setStatusText("Processing recording...");
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", padding: "20px" }}>
      <h1>Voice Emotion to Spotify</h1>
      {!accessToken ? (
        <div>
          <p>You must log in with Spotify to record your voice and add songs to your queue.</p>
          <button
            onClick={handleLogin}
            style={{
              fontSize: "18px",
              padding: "10px 20px",
              margin: "10px",
              cursor: "pointer",
            }}
          >
            Login with Spotify
          </button>
        </div>
      ) : (
        <div>
          <p>Logged in with Spotify.</p>
          <button
            onClick={startRecording}
            disabled={recording}
            style={{
              fontSize: "18px",
              padding: "10px 20px",
              margin: "10px",
              cursor: "pointer",
            }}
          >
            Start Recording
          </button>
          <button
            onClick={stopRecording}
            disabled={!recording}
            style={{
              fontSize: "18px",
              padding: "10px 20px",
              margin: "10px",
              cursor: "pointer",
            }}
          >
            Stop Recording
          </button>
        </div>
      )}
      <p style={{ fontWeight: "bold", marginTop: "20px" }}>{statusText}</p>
      <div style={{ marginTop: "20px" }}>{result}</div>
    </div>
  );
}
