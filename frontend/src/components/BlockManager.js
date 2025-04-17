import React, { useState } from "react";
import axios from "axios";
import { Droppable, Draggable } from "react-beautiful-dnd";

export default function BlockManager({ blocks, setBlocks }) {
  const [type, setType] = useState("Education");
  const [content, setContent] = useState("");

  async function addBlock() {
    if (!content.trim()) return;
    await axios.post("http://localhost:5000/blocks", { type, content });
    const res = await axios.get("http://localhost:5000/blocks");
    setBlocks(res.data);
    setContent("");
  }

  return (
    <div style={{ flex: 1 }}>
      <h2>Available Blocks</h2>
      <div style={{ marginBottom: "1rem" }}>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option>Education</option>
          <option>Experience</option>
          <option>Project</option>
          <option>Skill</option>
        </select>
        <br />
        <textarea
          rows={2}
          cols={30}
          placeholder="Describe this block"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <br />
        <button onClick={addBlock}>Add Block</button>
      </div>

      <Droppable droppableId="BLOCK_LIST">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              minHeight: "200px",
              padding: "0.5rem",
              border: "1px solid #ddd",
            }}
          >
            {blocks.map((b, idx) => (
              <Draggable key={b.id} draggableId={`block-${b.id}`} index={idx}>
                {(p, snapshot) => (
                  <div
                    ref={p.innerRef}
                    {...p.draggableProps}
                    {...p.dragHandleProps}
                    style={{
                      userSelect: "none",
                      padding: "0.5rem",
                      margin: "0 0 0.5rem 0",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      background: snapshot.isDragging ? "#e6f7ff" : "#fafafa",
                      ...p.draggableProps.style,
                    }}
                  >
                    <strong>[{b.type}]</strong> {b.content}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
