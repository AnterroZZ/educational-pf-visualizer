import Node from "./Nodes/Node";
import styles from "./MainPage.module.css";
import { useEffect, useState } from "react";
import { useControls } from "../Contex/ControlsContext";
import { recursiveBacktracking } from "../mazes/recursiveBacktracking";
import { useAlgorithm } from "../Contex/AlgorithmsContext";
import { recursive } from "../mazes/recursive";

// Node types are: clear, wall, start, end, visited
function singleNode(id, row, column) {
  return {
    id: id,
    row: row,
    column: column,
    type: "clear",
    prevType: "clear",
    neighbours: [],
  };
}

export const populateNodes = () => {
  let nodes = [];
  for (let row = 0; row < 21; row++) {
    let currentRow = [];
    for (let column = 0; column < 51; column++) {
      const node = singleNode(row * 50 + column, row, column);
      if (column === 11 && row === 11) node.type = "start";
      if (column === 39 && row === 11) node.type = "end";
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
  const { currentMazeAlgorithm } = useAlgorithm();

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
    allWalls();
    const stack = recursive(nodes);
    // const stack = recursiveBacktracking(nodes, setNodes);
    console.log(stack);
    // animate(stack);
  };

  const allWalls = () => {
    let newNodes = nodes.slice();
    for (let row = 0; row < 21; row++) {
      for (let column = 0; column < 51; column++) {
        const currentNode = newNodes[row][column];
        if (!(currentNode.type === "start" || currentNode.type === "end")) {
          newNodes[row][column] = { ...nodes[row][column], type: "wall" };
        }
      }
    }

    setNodes(newNodes);
  };

  const animate = (stack) => {
    const newNodes = nodes.slice();
    stack.map((node, indx) => {
      // setTimeout(() => {
      //   document.getElementById(
      //     `node-${node.node.row}-${node.node.column}`
      //   ).className = `${styles.node}`;
      //   newNodes[node.row][node.column].type = "clear";
      // }, indx * 50);
      console.log(node);
      // newNodes[node.row][node.column].type = "clear";
    });

    setNodes(newNodes);
  };

  useEffect(() => {
    setNodes(populateNodes());
    if (currentMazeAlgorithm === "Recursive division") {
      //Make everything a wall

      //Return a stack for visited nodes (base case scenario nodes ) -remember about start and end

      //Animate and set type after
      generateMaze(nodes, setNodes);
    }
  }, [currentMazeAlgorithm]);

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
