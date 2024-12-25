"use client"
import React, { useState, useRef } from 'react';

export default function RecordingComponent( { soapNote, setSoapNote, setSoapId } ) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState(null);
//   const [soapNote, setSoapNote] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const backendURL = process.env.BACKEND_URL

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Start or Pause Recording
  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      // Start recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioData(audioUrl);  // Store the audio URL for playback
        audioChunksRef.current = []; // Clear chunks after recording stops
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  // Send audio to backend and get SOAP note & transcript
  const sendAudioToBackend = async () => {
    if (!audioData) {
      alert('Please record something first.');
      return;
    }

    setIsLoading(true);
    
    // Create a FormData to send audio data to backend
    const formData = new FormData();
    const audioBlob = await fetch(audioData).then((res) => res.blob());
    formData.append('file', audioBlob, 'audio.wav');

    try {
      const response = await fetch(`${backendURL}/api/upload`, {  // Replace with your backend URL
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSoapNote(data.soap_note);
        setSoapId(data.transcript_id);
        setTranscript(data.transcription);
      } else {
        alert('Error processing audio');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while sending the audio.');
    }

    setIsLoading(false);
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold">Recording Interface</h2>
      
      {/* Start/Pause/Stop Button */}
      <button
        onClick={toggleRecording}
        className="mt-4 py-2 px-4 rounded bg-green-500 text-white hover:bg-green-600 transition"
      >
        {isRecording ? 'Pause Recording' : 'Start Recording'}
      </button>

      {/* Audio Playback */}
      {audioData && (
        <div className="mt-4">
          <audio controls src={audioData}></audio>
        </div>
      )}

      {/* Send Button to upload the audio and get SOAP and transcript */}
      <button
        onClick={sendAudioToBackend}
        disabled={isLoading}
        className={`mt-4 py-2 px-4 rounded ${
          isLoading ? 'bg-gray-500' : 'bg-blue-500'
        } text-white hover:bg-blue-600 transition`}
      >
        {isLoading ? 'Processing...' : 'Send Audio'}
      </button>

      {/* Display SOAP Note */}
      {soapNote && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">SOAP Note</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto max-h-64">{JSON.stringify(soapNote, null, 2)}</pre>
        </div>
      )}

      {/* Display Transcript */}
      {transcript && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Transcript</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto max-h-64">{JSON.stringify(transcript, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
