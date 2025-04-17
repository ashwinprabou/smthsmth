// src/components/Canvas.js
import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import jsPDF from "jspdf";

export default function Canvas({ canvasBlocks }) {
  const exportAsTextPDF = () => {
    const pdf = new jsPDF();
    const leftMargin = 10;
    const topMargin = 20;
    const lineHeight = 8;
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let y = topMargin;

    canvasBlocks.forEach((block) => {
      // 1) Block header (type)
      pdf.setFontSize(14);
      pdf.setFont(undefined, "bold");
      pdf.text(block.type, leftMargin, y);
      y += lineHeight;

      // 2) Block content (wrapped)
      pdf.setFontSize(12);
      pdf.setFont(undefined, "normal");
      // splitTextToSize wraps long text to page width minus margins
      const wrapped = pdf.splitTextToSize(
        block.content,
        pageWidth - leftMargin * 2
      );
      wrapped.forEach((line) => {
        // new page if needed
        if (y > pageHeight - topMargin) {
          pdf.addPage();
          y = topMargin;
        }
        pdf.text(line, leftMargin, y);
        y += lineHeight;
      });

      // 3) Spacer between blocks
      y += lineHeight;

      // page break if spacer pushes past bottom
      if (y > pageHeight - topMargin) {
        pdf.addPage();
        y = topMargin;
      }
    });

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

      <button style={{ marginTop: "1rem" }} onClick={exportAsTextPDF}>
        Export Canvas to PDF
      </button>
    </div>
  );
}
