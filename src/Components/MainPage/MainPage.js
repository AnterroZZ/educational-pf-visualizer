import Node from "./Nodes/Node";
import styles from "./MainPage.module.css";
import { useEffect, useState } from "react";
import { useControls } from "../Contex/ControlsContext";
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
      const node = singleNode(row * 51 + column, row, column);
      if (column === 11 && row === 11) node.type = "start";
      if (column === 39 && row === 11) node.type = "end";
      currentRow.push(node);
    }
    nodes.push(currentRow);
  }

  return nodes;
};

const updateNodes = (nodes, col, row, type, prevType = type) => {
  const newNodes = nodes.slice();
  const node = nodes[row][col];
  const newNode = { ...node, type: type, prevType: prevType };
  newNodes[row][col] = newNode;
  return newNodes;
};

const MainPage = () => {
  const [nodes, setNodes] = useState(populateNodes());
  const [isInDrawingMode, setIsInDrawingMode] = useState(false);
  const [isInBlockedState, setIsInBlockedState] = useState(false);
  const [drawingType, setDrawingType] = useState("");
  const { clear } = useControls();
  const { currentMazeAlgorithm } = useAlgorithm();

  useEffect(() => {
    setNodes(populateNodes());
  }, [clear]);

  useEffect(() => {
    switch (currentMazeAlgorithm) {
      case "Recursive backtracking":
        generateMaze(currentMazeAlgorithm, nodes);
        break;
      default:
        console.log("No such maze generating algo!");
    }
  }, [currentMazeAlgorithm]);

  const generateMaze = (currentMazeAlgorithm, nodes) => {
    let stack = [];
    allWalls();
    switch (currentMazeAlgorithm) {
      case "Recursive backtracking":
        stack = recursive(nodes);
        break;
      default:
        console.log("No such maze generating algo!");
    }

    animateMazeStack(stack);
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

  const animateMazeStack = (stack) => {
    setIsInBlockedState(true);
    const newNodesAnim = nodes.slice();
    const newNodes = nodes.slice();

    const mazeAnimationSpeed = 10;
    stack.forEach((currNode, indx) => {
      const { node, type } = currNode;
      const nodeType = newNodesAnim[node.row][node.column].type;
      if (mazeAnimationSpeed === 0) {
        if (!(nodeType === "start" || nodeType === "end")) {
          newNodes[node.row][node.column].type = "clear";
          setNodes(newNodes);
          setIsInBlockedState(false);
        }
      } else {
        setTimeout(() => {
          if (!(nodeType === "start" || nodeType === "end")) {
            if (type === "clear") {
              document.getElementById(
                `node-${node.row}-${node.column}`
              ).className = `${styles.node}`;
              newNodesAnim[node.row][node.column].type = "clear";
            } else {
              document.getElementById(
                `node-${node.row}-${node.column}`
              ).className = `${styles.visited}`;
              newNodesAnim[node.row][node.column].type = "visited";
            }
            newNodes[node.row][node.column].type = "clear";
          }
          if (stack.length === indx + 1) {
            setTimeout(() => {
              setNodes(newNodes);
              setIsInBlockedState(false);
            }, 500);
          }
        }, indx * mazeAnimationSpeed);
      }
    });
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
                  isInDrawingMode={isInDrawingMode}
                  setIsInDrawingMode={setIsInDrawingMode}
                  drawingType={drawingType}
                  setDrawingType={setDrawingType}
                  node={node}
                  nodes={nodes}
                  setNodes={setNodes}
                  isInBlockedState={isInBlockedState}
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
