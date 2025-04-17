import React, { useState } from "react";
import axios from "axios";

export default function GenerateResume() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState([]);

  async function generate() {
    const res = await axios.post("http://localhost:5000/generate", {
      jobTitle,
      jobDescription,
    });
    setResult(res.data);
  }

  return (
    <div>
      <h2>Generate Resume</h2>
      <input
        style={{ width: "80%" }}
        placeholder="Job Title"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
      />
      <br />
      <textarea
        rows={4}
        cols={60}
        placeholder="Job Description"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />
      <br />
      <button onClick={generate}>Generate</button>

      <h3>Recommended Blocks</h3>
      <ul>
        {result.map((b) => (
          <li key={b.id}>
            <strong>[{b.type}]</strong> {b.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
