import React, { useState, useEffect } from "react";
import axios from "axios";

export default function BlockManager({ onBlocksChange }) {
  const [type, setType] = useState("Education");
  const [content, setContent] = useState("");
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    fetchBlocks();
  }, []);

  async function fetchBlocks() {
    const res = await axios.get("http://localhost:5000/blocks");
    setBlocks(res.data);
    onBlocksChange(res.data);
  }

  async function addBlock() {
    if (!content) return;
    await axios.post("http://localhost:5000/blocks", { type, content });
    setContent("");
    fetchBlocks();
  }

  return (
    <div>
      <h2>Add Block</h2>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option>Education</option>
        <option>Experience</option>
        <option>Project</option>
        <option>Skill</option>
      </select>
      <br />
      <textarea
        rows={3}
        cols={40}
        placeholder="Block content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <br />
      <button onClick={addBlock}>Add Block</button>

      <h3>Current Blocks</h3>
      <ul>
        {blocks.map((b) => (
          <li key={b.id}>
            <strong>[{b.type}]</strong> {b.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
