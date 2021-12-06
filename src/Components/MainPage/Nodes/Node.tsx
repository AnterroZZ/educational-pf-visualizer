import { SingleNode } from "../MainPage";
import styles from "./Node.module.css";

interface Props {
  node: SingleNode;
  isInDrawingMode: boolean;
  setIsInDrawingMode: React.Dispatch<React.SetStateAction<boolean>>;
  setDrawingType: React.Dispatch<React.SetStateAction<string>>;
  drawingType: string;
  row: number;
  column: number;
  onMoveStartEnd: (row: number, col: number, prevRow: number, prevCol: number, type: string) => void;
  updateNodes: (col: number, row: number, type: string, prevType?: string) => void;
  isInBlockedState: boolean;
  setPreviousNode: React.Dispatch<
    React.SetStateAction<{
      row: number;
      column: number;
    }>
  >;
  previousNode: {
    row: number;
    column: number;
  };
}
const Node: React.FC<Props> = ({
  node,
  isInDrawingMode,
  setIsInDrawingMode,
  setDrawingType,
  drawingType,
  row,
  column,
  onMoveStartEnd,
  updateNodes,
  isInBlockedState,
  setPreviousNode,
  previousNode,
}) => {
  const handleOnEnter = () => {
    if (isInDrawingMode) {
      switch (drawingType) {
        case "wall":
          if (node.type === "clear" || node.type === "visited" || node.type === "path") {
            updateNodes(column, row, "wall", node.type);
          }
          break;
        case "clear":
          if (node.type === "wall") {
            node.prevType === "wall"
              ? updateNodes(column, row, "clear", "wall")
              : updateNodes(column, row, node.prevType, "wall");
          }
          break;
        case "start":
          onMoveStartEnd(row, column, previousNode.row, previousNode.column, "start");

          break;
        case "end":
          onMoveStartEnd(row, column, previousNode.row, previousNode.column, "end");
          break;
        default:
          console.error("Invalid drawing type: ", drawingType);
          break;
      }
    }
  };

  const handleStartDrawing = (event: any) => {
    event.preventDefault();
    console.log(node);
    setIsInDrawingMode(true);
    switch (node.type) {
      case "clear":
      case "visited":
      case "path":
        setDrawingType("wall");
        updateNodes(column, row, "wall", node.type);
        break;
      case "wall":
        setDrawingType("clear");
        node.prevType === "wall"
          ? updateNodes(column, row, "clear", "wall")
          : updateNodes(column, row, node.prevType, "wall");
        break;
      case "start":
        setDrawingType("start");
        break;
      case "end":
        setDrawingType("end");
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
      className={`${node.type === "clear" ? styles.clear : ""} ${node.type === "wall" ? styles.wall : ""}  ${
        node.type === "visited" ? styles.visited : ""
      } ${node.type === "path" ? styles.path : ""} ${node.type === "start" ? styles.start : ""}${
        node.type === "end" ? styles.end : ""
      } `}
    >
      {/* {node.id} */}
    </div>
  );
};

export default Node;
