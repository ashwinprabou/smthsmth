import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext } from "react-beautiful-dnd";
import BlockManager from "./components/BlockManager";
import Canvas from "./components/Canvas";

export default function App() {
  const [blocks, setBlocks] = useState([]);
  const [canvasBlocks, setCanvasBlocks] = useState([]);

  // initial fetch
  useEffect(() => {
    axios
      .get("http://localhost:5000/blocks")
      .then((res) => setBlocks(res.data))
      .catch(console.error);
  }, []);

  function onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) return;

    // dragging within same list
    if (source.droppableId === destination.droppableId) {
      const list =
        source.droppableId === "BLOCK_LIST"
          ? Array.from(blocks)
          : Array.from(canvasBlocks);
      const [moved] = list.splice(source.index, 1);
      list.splice(destination.index, 0, moved);

      if (source.droppableId === "BLOCK_LIST") setBlocks(list);
      else setCanvasBlocks(list);
    }
    // moving between lists
    else {
      let sourceList =
        source.droppableId === "BLOCK_LIST"
          ? Array.from(blocks)
          : Array.from(canvasBlocks);
      let destList =
        destination.droppableId === "BLOCK_LIST"
          ? Array.from(blocks)
          : Array.from(canvasBlocks);
      const [moved] = sourceList.splice(source.index, 1);
      destList.splice(destination.index, 0, moved);

      if (source.droppableId === "BLOCK_LIST") {
        setBlocks(sourceList);
        setCanvasBlocks(destList);
      } else {
        setCanvasBlocks(sourceList);
        setBlocks(destList);
      }
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "flex", gap: "2rem", padding: "1rem" }}>
        <BlockManager blocks={blocks} setBlocks={setBlocks} />
        <Canvas canvasBlocks={canvasBlocks} />
      </div>
    </DragDropContext>
  );
}
