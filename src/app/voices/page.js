"use client";

import { useState, useEffect, useRef } from "react";

export default function VoiceEmotionPage() {
  const [accessToken, setAccessToken] = useState(null);
  const [recording, setRecording] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [result, setResult] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // On mount, check for an access token in the URL or localStorage.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("accessToken");
    if (tokenFromUrl) {
      localStorage.setItem("spotifyAccessToken", tokenFromUrl);
      setAccessToken(tokenFromUrl);
      window.history.replaceState(null, "", window.location.pathname);
    } else {
      const storedToken = localStorage.getItem("spotifyAccessToken");
      if (storedToken) setAccessToken(storedToken);
    }
    // Set an initial status if token is present.
    if (accessToken) {
      setStatusText("Ready to record your voice!");
    }
  }, [accessToken]);

  // Redirect to the Flask login endpoint.
  const handleLogin = () => {
    const redirectUrl = encodeURIComponent(window.location.href);
    window.location.href = `http://localhost:8080/login?redirectUrl=${redirectUrl}`;
  };

  // Logout: clear token from localStorage and refresh.
  const handleLogout = () => {
    localStorage.removeItem("spotifyAccessToken");
    setAccessToken(null);
    setStatusText("");
    setResult(null);
    window.location.reload();
  };

  // Start recording: clear previous result, request microphone access.
  const startRecording = async () => {
    setResult(null); // Clear previous result.
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
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.wav");

        try {
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

  // Toggle recording button.
  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="page-wrapper">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-left">
          <a href="/">Home</a>
        </div>
        <div className="nav-right">
          {accessToken && (
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          )}
        </div>
      </nav>
      {/* Main Content */}
      <div className="container">
        <h1>Voice Emotion to Spotify</h1>
        {!accessToken ? (
          <div>
            <button onClick={handleLogin} className="login-button">
              Login with Spotify
            </button>
          </div>
        ) : (
          <div>
            <p className="info-text">Logged in with Spotify.</p>
            <button onClick={toggleRecording} className="record-button">
              {recording ? "Stop Recording" : "Start Recording"}
            </button>
          </div>
        )}
        <p className="status">{statusText}</p>
        <div className="result">{result}</div>
      </div>

      <style jsx>{`
        .page-wrapper {
          min-height: 100vh;
          background-color: #000;
          color: #fff;
          display: flex;
          flex-direction: column;
        }
        .navbar {
          width: 100%;
          padding: 20px 40px;
          background-color: #111;
          border-bottom: 2px solid #1db954;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .navbar a {
          color: #1db954;
          text-decoration: none;
          font-size: 26px;
        }
        .logout-button {
          background-color: #ff4c4c;
          color: #fff;
          border: none;
          padding: 12px 24px;
          border-radius: 5px;
          font-size: 20px;
          cursor: pointer;
        }
        .container {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 40px;
        }
        h1 {
          margin-bottom: 30px;
          font-size: 56px;
        }
        .info-text {
          font-size: 28px;
          margin: 15px 0;
        }
        button {
          font-size: 24px;
          padding: 15px 30px;
          margin: 15px;
          cursor: pointer;
          border: none;
          border-radius: 5px;
        }
        .login-button,
        .record-button {
          background-color: #1db954;
          color: #000;
        }
        .status {
          font-weight: bold;
          margin-top: 30px;
          font-size: 32px;
        }
        .result {
          margin-top: 30px;
          text-align: center;
          font-size: 28px;
        }
      `}</style>
    </div>
  );
}
