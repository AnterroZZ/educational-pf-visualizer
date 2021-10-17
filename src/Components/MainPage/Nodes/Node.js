import { useState } from "react";
import styles from "./Node.module.css";

const Node = ({
  node,
  isInDrawingMode,
  setIsInDrawingMode,
  setDrawingType,
  drawingType,
  row,
  column,
  setNodes,
  nodes,
  updateNodes,
}) => {
  const [singleNode, setSingleNode] = useState(node);
  const handleOnHover = () => {
    if (isInDrawingMode) {
      let node = nodes[row][column];
      switch (drawingType) {
        case "wall":
          if (singleNode.type === "clear") {
            nodes[row][column] = { ...node, type: "wall", prevType: "clear" };
            setSingleNode({ ...singleNode, type: "wall", prevType: "clear" });
          }
          break;
        case "clear":
          if (singleNode.type === "wall") {
            nodes[row][column] = { ...node, type: "clear", prevType: "wall" };
            setSingleNode({ ...singleNode, type: "clear", prevType: "wall" });
          }
          break;
        case "start":
          nodes[row][column] = { ...node, type: "start", prevType: node.type };
          setSingleNode({
            ...singleNode,
            type: "start",
            prevType: singleNode.type,
          });
          break;
        case "end":
          nodes[row][column] = { ...node, type: "end", prevType: node.type };
          setSingleNode({
            ...singleNode,
            type: "end",
            prevType: singleNode.type,
          });
          break;
        default:
          break;
      }
    }
  };

  const handleStartDrawing = (event) => {
    event.preventDefault();
    setIsInDrawingMode(true);
    switch (singleNode.type) {
      case "clear":
        let node = nodes[row][column];
        nodes[row][column] = { ...node, type: "wall" };
        setDrawingType("wall");
        setSingleNode({ ...singleNode, type: "wall" });

        console.log("Drawing type set to wall");
        break;
      case "wall":
        console.log("Drawing type set to clear");
        setSingleNode({ ...singleNode, type: "clear" });
        setDrawingType("clear");
        break;
      case "start":
        console.log("Moving starting node");
        setDrawingType("start");
        break;
      case "end":
        console.log("Moving ending node");
        setDrawingType("end");
        break;
      default:
        break;
    }
  };
  const handleOnLeave = () => {
    if (isInDrawingMode) {
      if (drawingType === "start" || drawingType === "end") {
        node.type = singleNode.prevType;
        setSingleNode({ ...singleNode, type: singleNode.prevType });
      }
    }
  };
  return (
    <div
      onMouseDown={handleStartDrawing}
      onMouseEnter={handleOnHover}
      onMouseLeave={handleOnLeave}
      className={`${singleNode.type === "clear" ? styles.node : ""} ${
        singleNode.type === "wall" ? styles.wall : ""
      } ${singleNode.type === "start" ? styles.start : ""}${
        singleNode.type === "end" ? styles.end : ""
      }`}
    ></div>
  );
};

export default Node;
