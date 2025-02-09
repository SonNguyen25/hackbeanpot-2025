"use client";

import { LogOut, Mic, MicOff } from "lucide-react"
import { useState, useEffect, useRef } from "react";

export default function VoiceEmotionPage() {
  const [accessToken, setAccessToken] = useState(null);
  const [recording, setRecording] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [result, setResult] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

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
    if (accessToken) {
      setStatusText("Ready to record your voice!");
    }
  }, [accessToken]);

  const handleLogin = () => {
    const redirectUrl = encodeURIComponent(window.location.href);
    window.location.href = `http://localhost:8080/login?redirectUrl=${redirectUrl}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("spotifyAccessToken");
    setAccessToken(null);
    setStatusText("");
    setResult(null);
    window.location.reload();
  };

  const startRecording = async () => {
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

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setStatusText("Processing recording...");
    }
  };

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-3xl w-full text-center p-8 bg-black-900 rounded-lg shadow-xl">
      <a className="text-1xl text-white font-bold">
  Get a song recommendation based on your current mood!
</a>

<br/><br/>
        <h1 className="text-5xl font-bold text-green-500">Voice Emotion to Spotify</h1>
        

<br/>
        {!accessToken ? (
          <div className="mt-6">
            <button
              onClick={handleLogin}
              className="bg-gradient-to-r from-green-400 to-blue-500 font-bold text-white px-8 py-4 rounded-md"
            >
              Login with Spotify
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <p className="text-2xl mb-4">Logged in with Spotify.</p>
            <button
              onClick={toggleRecording}
              className={`${
                recording ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600" : "bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
              } text-white font-bold px-8 py-4 rounded-md flex items-center justify-center mx-auto transition-colors duration-300`}
            >
             {recording ? (
                  <>
                    <MicOff className="mr-2" size={24} />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="mr-2" size={24} />
                    Start Recording
                  </>
                )}
            </button>
          </div>
        )}

        <p className="mt-6 font-bold text-2xl">{statusText}</p>
        <div className="mt-8">{result}</div>

        {accessToken && (
          <button
          onClick={handleLogout}
          className="mt-8 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold px-8 py-4 rounded-md flex items-center justify-center mx-auto transition-colors duration-300"
        >
          <LogOut className="mr-2" size={18} />
          Logout
        </button>
        )}
      </div>
    </div>
  );
}