import styles from "./Node.module.css";

const Node = ({
  node,
  isInDrawingMode,
  setIsInDrawingMode,
  setDrawingType,
  drawingType,
  row,
  column,
  onMoveStartEnd,
  nodes,
  updateNodes,
  isInBlockedState,
  setPreviousNode,
  previousNode,
}) => {
  const handleOnEnter = () => {
    if (isInDrawingMode) {
      let node = nodes[row][column];
      switch (drawingType) {
        case "wall":
          if (
            node.type === "clear" ||
            node.type === "visited" ||
            node.type === "path"
          ) {
            updateNodes(nodes, column, row, "wall", node.type);
          }
          break;
        case "clear":
          if (node.type === "wall") {
            node.prevType === "wall"
              ? updateNodes(nodes, column, row, "clear", "wall")
              : updateNodes(nodes, column, row, node.prevType, "wall");
          }
          break;
        case "start":
          onMoveStartEnd(
            row,
            column,
            previousNode.row,
            previousNode.column,
            "start"
          );

          break;
        case "end":
          onMoveStartEnd(
            row,
            column,
            previousNode.row,
            previousNode.column,
            "end"
          );
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
        updateNodes(nodes, column, row, "wall", node.type);

        console.log("Drawing type set to wall");
        break;
      case "wall":
        setDrawingType("clear");
        node.prevType === "wall"
          ? updateNodes(nodes, column, row, "clear", "wall")
          : updateNodes(nodes, column, row, node.prevType, "wall");

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
    setPreviousNode({ row: row, column: column });
  };
  return (
    <div
      id={`node-${row}-${column}`}
      onMouseDown={(e) => {
        if (!isInBlockedState) handleStartDrawing(e);
      }}
      onMouseEnter={handleOnEnter}
      onMouseOver={handleOnLeave}
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
