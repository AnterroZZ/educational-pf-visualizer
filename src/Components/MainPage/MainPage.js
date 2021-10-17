import Node from "./Nodes/Node";
import styles from "./MainPage.module.css";
import { useEffect, useState } from "react";

// Node types are: clear, wall, start, end, visited
function SingleNode(id, row, column) {
  this.id = id;
  this.row = row;
  this.column = column;
  this.type = "clear";
  this.isStart = false;
  this.isEnd = false;
  this.isWall = false;
  this.isVisited = false;
}

const populateNodes = () => {
  let nodes = [];
  for (let row = 0; row < 20; row++) {
    let currentRow = [];
    for (let column = 0; column < 50; column++) {
      const node = new SingleNode(row * 50 + column, row, column);
      if (column === 10 && row === 10) node.type = "start";
      if (column === 40 && row === 10) node.type = "end";
      currentRow.push(node);
    }
    nodes.push(currentRow);
  }

  return nodes;
};

const MainPage = () => {
  const [nodes, setNodes] = useState([]);
  const [isInDrawingMode, setIsInDrawingMode] = useState(false);
  const [drawingType, setDrawingType] = useState("");

  useEffect(() => {
    setNodes(populateNodes());
  }, []);

  return (
    <div
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
                  isInDrawingMode={isInDrawingMode}
                  setIsInDrawingMode={setIsInDrawingMode}
                  drawingType={drawingType}
                  setDrawingType={setDrawingType}
                  node={node}
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
