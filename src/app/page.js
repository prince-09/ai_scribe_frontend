// app/page.js
"use client"
import RecordingComponent from '../components/Recorder';
import SoapNote from '../components/SoapNote';
import { useState } from 'react';

export default function Home() {
  const [soapNote, setSoapNote] = useState({
    subjective: "Patient reports feeling tired and having a sore throat.",
    objective: "No vital signs recorded.",
    assessment: "Likely viral infection.",
    plan: "Prescribe acetaminophen and advise rest."
  });
  const [soapId, setSoapId] = useState();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Medical Transcript App</h1>
      
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl mb-4">Recording Interface</h2>
        <RecordingComponent soapNote={soapNote} setSoapNote={setSoapNote} setSoapId={setSoapId}/>
      </div>
      
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg mt-6">
        <h2 className="text-xl mb-4">SOAP Note</h2>
        <SoapNote soapNote={soapNote} setSoapNote={setSoapNote} soapId={soapId}/>
      </div>
    </div>
  );
}
