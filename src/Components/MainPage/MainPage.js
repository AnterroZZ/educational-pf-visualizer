import Node from "./Nodes/Node";
import styles from "./MainPage.module.css";
import { useEffect, useState } from "react";
import { useControls } from "../Contex/ControlsContext";
import { recursive } from "../mazes/recursive";

// Node types are: clear, wall, start, end, visited
function singleNode(id, row, column) {
  return {
    id: id,
    row: row,
    column: column,
    type: "clear",
    prevType: "clear",
  };
}

export const populateNodes = () => {
  let nodes = [];
  for (let row = 0; row < 21; row++) {
    let currentRow = [];
    for (let column = 0; column < 51; column++) {
      const node = singleNode(row * 50 + column, row, column);
      if (column === 10 && row === 10) node.type = "start";
      if (column === 40 && row === 10) node.type = "end";
      currentRow.push(node);
    }
    nodes.push(currentRow);
  }

  return nodes;
};

const MainPage = () => {
  const [nodes, setNodes] = useState(populateNodes());
  const [isInDrawingMode, setIsInDrawingMode] = useState(false);
  const [drawingType, setDrawingType] = useState("");
  const { clear } = useControls();

  const updateNodes = (nodes, col, row, type, prevType = type) => {
    const newNodes = nodes.slice();
    const node = nodes[row][col];
    const newNode = { ...node, type: type, prevType: prevType };
    newNodes[row][col] = newNode;
    return newNodes;
  };

  useEffect(() => {
    setNodes(populateNodes());
  }, [clear]);

  const generateMaze = () => {
    setNodes(populateNodes());
    recursive(nodes, setNodes, updateNodes);
  };

  return (
    <div
      onMouseUp={() => setIsInDrawingMode(false)}
      onMouseLeave={() => setIsInDrawingMode(false)}
      className={styles.nodesWraper}
    >
      {nodes.map((row, rowIdx) => {
        return (
          <div className={styles.rowWraper} key={rowIdx}>
            {row.map((node, nodeidx) => {
              return (
                <Node
                  key={node.id}
                  row={node.row}
                  column={node.column}
                  generateMaze={generateMaze}
                  isInDrawingMode={isInDrawingMode}
                  setIsInDrawingMode={setIsInDrawingMode}
                  drawingType={drawingType}
                  setDrawingType={setDrawingType}
                  node={node}
                  nodes={nodes}
                  setNodes={setNodes}
                  updateNodes={updateNodes}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default MainPage;
