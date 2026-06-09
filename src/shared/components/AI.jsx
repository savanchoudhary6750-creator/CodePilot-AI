import React, { useState } from "react";

export default function AI() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const analyzeCode = async () => {
    if (!code && !error) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_OPENAI_API_KEY`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a senior debugging assistant. Find errors in code and explain fixes simply.",
            },
            {
              role: "user",
              content: `
Code:
${code}

Error:
${error}

Find the problem and give the correct fixed code with explanation.
              `,
            },
          ],
        }),
      });

      const data = await res.json();
      setResponse(data.choices?.[0]?.message?.content || "No response");
    } catch (err) {
      setResponse("Error connecting to AI API");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>AI Debug Assistant ⚡</h2>

      <textarea
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={10}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <textarea
        placeholder="Paste error message..."
        value={error}
        onChange={(e) => setError(e.target.value)}
        rows={5}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <button onClick={analyzeCode} disabled={loading}>
        {loading ? "Analyzing..." : "Find Problem"}
      </button>

      <div
        style={{
          marginTop: "20px",
          background: "#111",
          color: "#0f0",
          padding: "10px",
          whiteSpace: "pre-wrap",
        }}
      >
        {response}
      </div>
    </div>
  );
}