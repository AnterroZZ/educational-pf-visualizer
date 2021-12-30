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
    if (!isInDrawingMode) {
      return;
    }

    if (drawingType === "wall") {
      if (node.type === "clear" || node.type === "visited" || node.type === "path") {
        updateNodes(column, row, "wall", node.type);
      }
    }

    if (drawingType === "clear") {
      if (node.type === "wall") {
        node.prevType === "wall"
          ? updateNodes(column, row, "clear", "wall")
          : updateNodes(column, row, node.prevType, "wall");
      }
    }

    if (drawingType === "start") {
      onMoveStartEnd(row, column, previousNode.row, previousNode.column, "start");
    }

    if (drawingType === "end") {
      onMoveStartEnd(row, column, previousNode.row, previousNode.column, "end");
    }
  };

  const handleStartDrawing = (event: any) => {
    event.preventDefault();
    setIsInDrawingMode(true);

    if (node.type === "clear" || node.type === "visited" || node.type === "path") {
      setDrawingType("wall");
      updateNodes(column, row, "wall", node.type);
    }

    if (node.type === "wall") {
      setDrawingType("clear");
      node.prevType === "wall"
        ? updateNodes(column, row, "clear", "wall")
        : updateNodes(column, row, node.prevType, "wall");
    }

    if (node.type === "start") {
      setDrawingType("start");
    }

    if (node.type === "end") {
      setDrawingType("end");
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
