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
  isInBlockedState,
}) => {
  const handleOnHover = () => {
    if (isInDrawingMode) {
      let node = nodes[row][column];
      switch (drawingType) {
        case "wall":
          if (
            node.type === "clear" ||
            node.type === "visited" ||
            node.type === "path"
          ) {
            setNodes(updateNodes(nodes, column, row, "wall", node.type));
          }
          break;
        case "clear":
          if (node.type === "wall") {
            node.prevType === "wall"
              ? setNodes(updateNodes(nodes, column, row, "clear", "wall"))
              : setNodes(
                  updateNodes(nodes, column, row, node.prevType, "wall")
                );
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
    console.log(node);
    setIsInDrawingMode(true);
    switch (node.type) {
      case "clear":
      case "visited":
      case "path":
        setDrawingType("wall");
        setNodes(updateNodes(nodes, column, row, "wall", node.type));

        console.log("Drawing type set to wall");
        break;
      case "wall":
        setDrawingType("clear");
        node.prevType === "wall"
          ? setNodes(updateNodes(nodes, column, row, "clear", "wall"))
          : setNodes(updateNodes(nodes, column, row, node.prevType, "wall"));

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
      }
    }
  };
  return (
    <div
      id={`node-${row}-${column}`}
      onMouseDown={(e) => {
        if (!isInBlockedState) handleStartDrawing(e);
      }}
      onMouseEnter={handleOnHover}
      onMouseLeave={handleOnLeave}
      className={`${node.type === "clear" ? styles.node : ""} ${
        node.type === "wall" ? styles.wall : ""
      }  ${node.type === "visited" ? styles.visited : ""} ${
        node.type === "path" ? styles.path : ""
      } ${node.type === "start" ? styles.start : ""}${
        node.type === "end" ? styles.end : ""
      } `}
    >
      {/* {node.id} */}
    </div>
  );
};

export default Node;
