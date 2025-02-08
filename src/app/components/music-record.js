import { useState, useRef } from "react";
import { Music } from "lucide-react";

const MusicPlaylist = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Array<Blob>>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
        audioChunksRef.current = [];

        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.mp3");

        await fetch("https://your-backend.com/upload", {
          method: "POST",
          body: formData,
        });

        console.log("Audio file sent to backend");
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className="flex items-center gap-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        <Music className="w-5 h-5" />
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
};

export default MusicPlaylist;
