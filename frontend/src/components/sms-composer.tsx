import React, { useState } from "react";

interface SmsComposerProps {
  portalId: string;
  objectId: string;
  phoneNumber: string;
}

export const SmsComposer: React.FC<SmsComposerProps> = ({ portalId, objectId, phoneNumber }) => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    try {
      setStatus("sending");
      const response = await fetch("/api/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          portalId,
          to: phoneNumber,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send SMS");
      }

      await response.json();
      setStatus("success");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-lg font-semibold mb-4">Send SMS</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">To:</label>
        <input
          type="text"
          value={phoneNumber}
          disabled
          className="w-full p-2 border rounded bg-gray-50"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Message:</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full p-2 border rounded"
          placeholder="Type your message here..."
        />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {message.length} characters
        </span>
        <button
          onClick={handleSend}
          disabled={status === "sending" || !message.trim()}
          className={`px-4 py-2 rounded ${
            status === "sending"
              ? "bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {status === "sending" ? "Sending..." : "Send SMS"}
        </button>
      </div>
      {status === "error" && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      {status === "success" && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
          Message sent successfully!
        </div>
      )}
    </div>
  );
};
