import React, { useState } from "react";
import BlockManager from "./components/BlockManager";
import GenerateResume from "./components/GenerateResume";

export default function App() {
  const [blocks, setBlocks] = useState([]);
  return (
    <div style={{ padding: 20 }}>
      <h1>Resume Modifier (MVP)</h1>
      <BlockManager onBlocksChange={setBlocks} />
      <hr />
      <GenerateResume />
    </div>
  );
}
