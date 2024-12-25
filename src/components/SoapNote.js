"use client";
// components/SoapNote.js
import { useState } from "react";

export default function SoapNote({ soapNote, setSoapNote, soapId }) {
  const [isSaving, setIsSaving] = useState(false); // For showing saving status
  const [message, setMessage] = useState(""); // For showing success/error messages
  const backendURL = process.env.BACKEND_URL

  const handleEdit = (key, value) => {
    setSoapNote({
      ...soapNote,
      [key]: value,
    });
  };

  const saveSoapNote = async () => {
    try {
      setIsSaving(true);
      setMessage("");
      // Send updated SOAP note to the backend using fetch
      const response = await fetch(`${backendURL}/api/transcription?id=${soapId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjective: soapNote.subjective,
          objective: soapNote.objective,
          assessment: soapNote.assessment,
          plan: soapNote.plan,
        }),
      });

      if (response.ok) {
        setMessage("SOAP Note saved successfully!");
      } else {
        const errorData = await response.json();
        setMessage(`Failed to save SOAP Note: ${errorData.detail || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error saving SOAP note:", error);
      setMessage("Failed to save SOAP Note. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-gray-500">SOAP Note ID</h3>
        <p className="text-gray-800">{soapId}</p>
      </div>

      <div>
        <h3 className="font-semibold text-lg">Subjective</h3>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={soapNote.subjective}
          onChange={(e) => handleEdit("subjective", e.target.value)}
        />
      </div>

      <div>
        <h3 className="font-semibold text-lg">Objective</h3>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={soapNote.objective}
          onChange={(e) => handleEdit("objective", e.target.value)}
        />
      </div>

      <div>
        <h3 className="font-semibold text-lg">Assessment</h3>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={soapNote.assessment}
          onChange={(e) => handleEdit("assessment", e.target.value)}
        />
      </div>

      <div>
        <h3 className="font-semibold text-lg">Plan</h3>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={soapNote.plan}
          onChange={(e) => handleEdit("plan", e.target.value)}
        />
      </div>

      <button
        className={`btn mt-4 w-full ${
          isSaving ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        } text-white`}
        onClick={saveSoapNote}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save SOAP Note"}
      </button>

      {message && (
        <p className={`mt-2 text-center ${message.includes("success") ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
