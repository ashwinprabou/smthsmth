import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Canvas({ canvasBlocks }) {
  const exportAsPDF = async () => {
    const canvasEl = document.getElementById("canvas-area");
    const blob = await html2canvas(canvasEl).then((canvas) =>
      canvas.toDataURL("image/png")
    );
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(blob);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(blob, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("resume.pdf");
  };

  return (
    <div style={{ flex: 1 }}>
      <h2>Canvas</h2>
      <Droppable droppableId="CANVAS">
        {(provided) => (
          <div
            id="canvas-area"
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              minHeight: "300px",
              padding: "0.5rem",
              border: "2px dashed #aaa",
            }}
          >
            {canvasBlocks.map((b, idx) => (
              <Draggable key={b.id} draggableId={`canvas-${b.id}`} index={idx}>
                {(p, snapshot) => (
                  <div
                    ref={p.innerRef}
                    {...p.draggableProps}
                    {...p.dragHandleProps}
                    style={{
                      userSelect: "none",
                      padding: "0.5rem",
                      margin: "0 0 0.5rem 0",
                      border: "1px solid #888",
                      borderRadius: "4px",
                      background: snapshot.isDragging ? "#fff3e0" : "#fff",
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

      <button style={{ marginTop: "1rem" }} onClick={exportAsPDF}>
        Export Canvas to PDF
      </button>
    </div>
  );
}
