import Node from "./Nodes/Node";
import styles from "./MainPage.module.css";
import nodeStyles from "./Nodes/Node.module.css";
import { useEffect, useState } from "react";
import { useControls } from "../Contex/ControlsContext";
import { useAlgorithm } from "../Contex/AlgorithmsContext";
import { recursive } from "../../algorithms/mazes/recursive";

// Node types are: clear, wall, start, end, visited
function singleNode(id, row, column) {
  return {
    id: id,
    row: row,
    column: column,
    type: "clear",
    prevType: "clear",
    neighbours: [],
    distance: Infinity,
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
    switch (currentMazeAlgorithm) {
      case "Recursive backtracking":
        stack = recursive(nodes);
        break;
      default:
        console.log("No such maze generating algo!");
    }

    // animateMazeStack(stack);
    alternateAnimate(stack);
  };

  const animateMazeStack = (stack) => {
    setIsInBlockedState(true);
    const newNodesAnim = JSON.parse(JSON.stringify(nodes));
    const newNodes = JSON.parse(JSON.stringify(nodes));

    //Transform all nodes to wall type
    for (let row = 0; row < nodes.length; row++) {
      for (let column = 0; column < nodes[0].length; column++) {
        const currentNode = newNodes[row][column];
        if (!(currentNode.type === "start" || currentNode.type === "end")) {
          document.getElementById(
            `node-${currentNode.row}-${currentNode.column}`
          ).className = `${nodeStyles.wall}`;
          newNodes[row][column] = { ...nodes[row][column], type: "wall" };
        }
      }
    }

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
              ).className = `${nodeStyles.node}`;
              newNodesAnim[node.row][node.column].type = "clear";
            } else {
              document.getElementById(
                `node-${node.row}-${node.column}`
              ).className = `${nodeStyles.visited}`;
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
        }, 1000 + indx * mazeAnimationSpeed);
      }
    });
  };

  const alternateAnimate = (stack) => {
    setIsInBlockedState(true);
    const newNodes = JSON.parse(JSON.stringify(nodes)).flat();
    const nooods = JSON.parse(JSON.stringify(nodes));
    const onlyWalls = newNodes.filter((arrNode) => {
      let x = true;
      stack.forEach((stackElem) => {
        const { node } = stackElem;
        if (node.id === arrNode.id) x = false;
      });
      return x;
    });

    for (let row = 0; row < nodes.length; row++) {
      for (let column = 0; column < nodes[0].length; column++) {
        const currentNode = nooods[row][column];
        if (!(currentNode.type === "start" || currentNode.type === "end")) {
          document.getElementById(
            `node-${currentNode.row}-${currentNode.column}`
          ).className = `${nodeStyles.node}`;
          nooods[row][column] = { ...nodes[row][column], type: "clear" };
        }
      }
    }

    onlyWalls.forEach((currNode, indx) => {
      setTimeout(() => {
        if (!(currNode.type === "start" || currNode.type === "end")) {
          document.getElementById(
            `node-${currNode.row}-${currNode.column}`
          ).className = `${nodeStyles.wall}`;

          nooods[currNode.row][currNode.column].type = "wall";
        }
        if (stack.length === indx + 1) {
          setTimeout(() => {
            setNodes(nooods);
            setIsInBlockedState(false);
          }, 500);
        }
      }, indx * 5);
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
