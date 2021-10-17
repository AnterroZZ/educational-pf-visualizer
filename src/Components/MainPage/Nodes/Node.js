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
  generateMaze,
  updateNodes,
}) => {
  const handleOnHover = () => {
    if (isInDrawingMode) {
      let node = nodes[row][column];
      switch (drawingType) {
        case "wall":
          if (node.type === "clear") {
            setNodes(updateNodes(nodes, column, row, "wall", "clear"));
          }
          break;
        case "clear":
          if (node.type === "wall") {
            setNodes(updateNodes(nodes, column, row, "clear", "wall"));
          }
          break;
        case "start":
          setNodes(updateNodes(nodes, column, row, "start", node.type));
          break;
        case "end":
          setNodes(updateNodes(nodes, column, row, "end", node.type));
          break;
        default:
          console.error("Invalid drawing type: ", drawingType);
          break;
      }
    }
  };

  const handleStartDrawing = (event) => {
    event.preventDefault();
    setIsInDrawingMode(true);
    if (node.id === 0) {
      generateMaze();
      return;
    }
    switch (node.type) {
      case "clear":
        setDrawingType("wall");
        setNodes(updateNodes(nodes, column, row, "wall", "clear"));

        console.log("Drawing type set to wall");
        break;
      case "wall":
        setDrawingType("clear");
        setNodes(updateNodes(nodes, column, row, "clear", "wall"));

        console.log("Drawing type set to clear");
        break;
      case "start":
        setDrawingType("start");

        console.log("Moving starting node");
        break;
      case "end":
        setDrawingType("end");

        console.log("Moving ending node");
        break;
      default:
        break;
    }
  };
  const handleOnLeave = () => {
    if (isInDrawingMode) {
      if (drawingType === "start" || drawingType === "end") {
        setNodes(updateNodes(nodes, column, row, node.prevType));
        // setSingleNode({ ...singleNode, type: singleNode.prevType });
      }
    }
  };
  return (
    <div
      onMouseDown={handleStartDrawing}
      onMouseEnter={handleOnHover}
      onMouseLeave={handleOnLeave}
      className={`${node.type === "clear" ? styles.node : ""} ${
        node.type === "wall" ? styles.wall : ""
      } ${node.type === "start" ? styles.start : ""}${
        node.type === "end" ? styles.end : ""
      }`}
    >
      {/* {node.id} */}
    </div>
  );
};

export default Node;
