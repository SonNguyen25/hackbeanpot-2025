"use client";

import { useState, useEffect, useRef } from "react";

export default function VoiceEmotionPage() {
  const [accessToken, setAccessToken] = useState(null);
  const [recording, setRecording] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [result, setResult] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // On mount, check for an access token in the URL or in localStorage.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("accessToken");
    if (tokenFromUrl) {
      localStorage.setItem("spotifyAccessToken", tokenFromUrl);
      setAccessToken(tokenFromUrl);
      // Clean the URL so the token is removed from the visible URL.
      window.history.replaceState(null, "", window.location.pathname);
    } else {
      const storedToken = localStorage.getItem("spotifyAccessToken");
      if (storedToken) setAccessToken(storedToken);
    }
    // If a token is already available, set an initial status.
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

  // Start recording using the MediaRecorder API.
  const startRecording = async () => {
    // Clear any previous result.
    setResult(null);
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
            setResult(<p className="text-red-500">⚠️ {data.error}</p>);
          } else {
            setResult(
              <div className="mt-6 text-xl">
                <h3 className="font-bold text-green-500">🎭 Detected Emotion: {data.emotion}</h3>
                <h4 className="mt-4">🎵 Song Recommendation:</h4>
                <p className="mt-2">
                  <span className="font-bold">{data.matched_song.track_name}</span> by {data.matched_song.artist}
                </p>
                <p className="mt-2">The recommended song has been added to your Spotify queue.</p>
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

  // Toggle button: if recording, stop; if not, start.
  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10">
      {/* Header (not fixed, just a top section) */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-8 px-4">
        <h1 className="text-5xl font-bold text-green-500">Voice Emotion to Spotify</h1>
        {accessToken && (
          <button onClick={handleLogout} className="bg-red-500 text-white px-6 py-2 rounded-md text-xl font-semibold">
            Logout
          </button>
        )}
      </header>

      {/* Main Content */}
      <div className="w-full max-w-4xl flex flex-col items-center px-4">
        {!accessToken ? (
          <div className="mb-8">
            <button onClick={handleLogin} className="bg-green-500 text-black px-8 py-4 rounded-md text-2xl font-semibold">
              Login with Spotify
            </button>
          </div>
        ) : (
          <div className="mb-8">
            <p className="text-2xl mb-4">Logged in with Spotify.</p>
            <button onClick={toggleRecording} className="bg-green-500 text-black px-8 py-4 rounded-md text-2xl font-semibold">
              {recording ? "Stop Recording" : "Start Recording"}
            </button>
          </div>
        )}
        <p className="mt-6 font-bold text-2xl">{statusText}</p>
        <div className="mt-8 text-center">{result}</div>
      </div>
    </div>
  );
}
