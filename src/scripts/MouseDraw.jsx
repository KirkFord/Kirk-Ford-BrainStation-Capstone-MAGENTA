import React, { useMemo, useState, useRef, useEffect, useCallback } from "react";
import * as d3 from "d3";

const Line = ({ thickness, points }) => {
  const line = useMemo(() => {
    return d3
      .line()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(d3.curveBasisOpen);
  }, []);

  return (
    <path
      d={line(points)}
      style={{
        stroke: "black",
        strokeWidth: thickness,
        strokeLinejoin: "round",
        strokeLinecap: "round",
        fill: "none"
      }}
    />
  );
};

export const MouseDraw = ({ x, y, width, height, thickness }) => {
  const [drawing, setDrawing] = useState(false);
  const [erasing, setErasing] = useState(false);
  const [currentLine, setCurrentLine] = useState({ thickness, points: [] });
  const [lines, setLines] = useState([]);
  const drawingAreaRef = useRef();
  const eraserRadius = 5;

  const mouseMove = useCallback(
    function (event) {
      const [mouseX, mouseY] = d3.pointer(event);
      if (drawing) {
        setCurrentLine((line) => ({
          ...line,
          points: [...line.points, { x: mouseX, y: mouseY }]
        }));
      } else if (erasing) {
        setLines((prevLines) =>
          prevLines
            .map((line) => {
              // Split the line into segments if the eraser touches it
              const newLineSegments = [];
              let currentSegment = [];

              line.points.forEach((point, i) => {
                const distance = Math.hypot(point.x - mouseX, point.y - mouseY);
                if (distance > eraserRadius) {
                  // If the point is outside the eraser radius, add it to the current segment
                  currentSegment.push(point);
                } else {
                  // If the point is inside the eraser radius, finish the current segment and start a new one
                  if (currentSegment.length > 0) {
                    newLineSegments.push({ thickness: line.thickness, points: currentSegment });
                  }
                  currentSegment = [];
                }

                // If we reach the last point, push any remaining segment
                if (i === line.points.length - 1 && currentSegment.length > 0) {
                  newLineSegments.push({ thickness: line.thickness, points: currentSegment });
                }
              });

              return newLineSegments;
            })
            .flat()
        );
      }
    },
    [drawing, erasing, eraserRadius]
  );

  function enableDrawing() {
    setCurrentLine({ thickness, points: [] });
    setDrawing(true);
  }

  function enableErasing() {
    setErasing(true);
  }

  function disableDrawingOrErasing() {
    if (drawing) {
      setDrawing(false);
      setLines((lines) => [...lines, currentLine]);
    } else if (erasing) {
      setErasing(false);
    }
  }

  useEffect(() => {
    const area = d3.select(drawingAreaRef.current);
    area.on("mousemove", mouseMove);
    return () => area.on("mousemove", null);
  }, [mouseMove]);

  return (
    <g
      transform={`translate(${x}, ${y})`}
      ref={drawingAreaRef}
      onMouseDown={(event) => {
        if (event.button === 0) {
          enableDrawing(); // Left click to draw
        } else if (event.button === 2) {
          enableErasing(); // Right click to erase
        }
      }}
      onMouseUp={disableDrawingOrErasing}
      onContextMenu={(e) => e.preventDefault()} // Disable the default right-click menu
    >
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        style={{ fill: "pink" }}
      />
      {lines.map((line, i) => (
        <Line thickness={line.thickness} points={line.points} key={i} />
      ))}
      {drawing && <Line thickness={currentLine.thickness} points={currentLine.points} />}
    </g>
  );
};
