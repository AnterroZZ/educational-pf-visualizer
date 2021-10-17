import { useState } from "react";
import styles from "./Node.module.css";

const Node = ({
  node,
  isInDrawingMode,
  setIsInDrawingMode,
  setDrawingType,
  drawingType,
}) => {
  const [singleNode, setSingleNode] = useState(node);
  const handleOnHover = () => {
    if (isInDrawingMode) {
      switch (drawingType) {
        case "wall":
          if (singleNode.type === "clear") {
            setSingleNode({ ...singleNode, type: "wall", prevType: "clear" });
          }
          break;
        case "clear":
          if (singleNode.type === "wall") {
            setSingleNode({ ...singleNode, type: "clear", prevType: "wall" });
          }
          break;
        case "start":
          setSingleNode({
            ...singleNode,
            type: "start",
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
      default:
        break;
    }
  };
  const handleOnLeave = () => {
    if (isInDrawingMode) {
      switch (drawingType) {
        case "start":
          setSingleNode({ ...singleNode, type: singleNode.prevType });
          break;
        default:
          break;
      }
    }
  };
  const handleStopDrawing = () => {
    setIsInDrawingMode(false);
  };
  return (
    <div
      onMouseDown={handleStartDrawing}
      onMouseUp={handleStopDrawing}
      onMouseOver={handleOnHover}
      onMouseLeave={handleOnLeave}
      className={`${styles.node} ${
        singleNode.type === "wall" ? styles.wall : ""
      } ${singleNode.type === "start" ? styles.start : ""}${
        singleNode.type === "end" ? styles.end : ""
      }`}
    ></div>
  );
};

export default Node;
