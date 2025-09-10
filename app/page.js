"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState("");

  // Normal chat
  const handleChat = async () => {
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      setResponse("Error: " + error.message);
    }

    setLoading(false);
  };

  // Streaming chat
  const handleStreamChat = async () => {
    setLoading(true);
    setStreamingResponse("");

    try {
      const res = await fetch("/api/chat-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data:")) {
            try {
              const data = JSON.parse(line.slice(5));
              if (data.content) {
                setStreamingResponse((prev) => prev + data.content);
              }
            } catch {
              // ignore malformed chunks
            }
          }
        }
      }
    } catch (error) {
      setStreamingResponse("Error: " + error.message);
    }

    setLoading(false);
  };

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🚀 AI Integrated Project</h1>

        {/* Input */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          rows={4}
          style={styles.textarea}
        />

        {/* Buttons */}
        <div style={styles.buttonRow}>
          <button
            onClick={handleChat}
            disabled={loading}
            style={{ ...styles.button, backgroundColor: "#f97316" }}
          >
            {loading ? "Loading..." : "Chat"}
          </button>

          <button
            onClick={handleStreamChat}
            disabled={loading}
            style={{ ...styles.button, backgroundColor: "#16a34a" }}
          >
            {loading ? "Loading..." : "Stream Chat"}
          </button>
        </div>

        {/* Normal Response */}
        <div style={styles.responseBox}>
          <h2 style={styles.responseTitle}>💡 Response</h2>
          <div>{response}</div>
        </div>

        {/* Streaming Response */}
        <div style={styles.responseBox}>
          <h2 style={styles.responseTitle}>⚡ Streaming Response</h2>
          <div>{streamingResponse}</div>
        </div>
      </div>
    </main>
  );
}


const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
    color: "#fff",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "700px",
    backgroundColor: "#171717",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "12px",
    border: "1px solid #333",
    backgroundColor: "#0a0a0a",
    color: "#fff",
    marginBottom: "16px",
    resize: "none",
  },
  buttonRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
  },
  button: {
    flex: 1,
    padding: "12px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "0.2s ease",
  },
  responseBox: {
    backgroundColor: "#0d0d0d",
    padding: "16px",
    borderRadius: "12px",
    marginTop: "12px",
    border: "1px solid #333",
    whiteSpace: "pre-wrap",
  },
  responseTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "8px",
  },
};
