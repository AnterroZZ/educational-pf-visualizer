import Node from "./Nodes/Node";
import styles from "./MainPage.module.css";
import nodeStyles from "./Nodes/Node.module.css";
import { useEffect, useState } from "react";
import { useControls } from "../Contex/ControlsContext";
import { useAlgorithm } from "../Contex/AlgorithmsContext";
import { recursive } from "../../algorithms/mazes/recursive";
import { randomMaze } from "../../algorithms/mazes/random";
import { dijkstra } from "../../algorithms/pathfinding/dijkstra";
import { astar } from "../../algorithms/pathfinding/astar";
import { breadth } from "../../algorithms/pathfinding/breadth";
import { best } from "../../algorithms/pathfinding/best";
import { depth } from "../../algorithms/pathfinding/depth";

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

let nodes = populateNodes();

const clearPaths = () => {
  for (let row = 0; row < nodes.length; row++) {
    for (let column = 0; column < nodes[0].length; column++) {
      const currentNode = nodes[row][column];
      if (currentNode.type === "visited" || currentNode.type === "path") {
        nodes[row][column] = {
          ...currentNode,
          type: "clear",
          distance: Infinity,
        };
      }
      if (currentNode.type === "end") {
        nodes[row][column] = {
          ...currentNode,
          type: "end",
          distance: Infinity,
        };
      }
    }
  }
};

const MainPage = () => {
  // const [nodes, setNodes] = useState(populateNodes());
  const [previousNode, setPreviousNode] = useState({ row: 0, column: 0 });
  const [isInDrawingMode, setIsInDrawingMode] = useState(false);
  const [isInBlockedState, setIsInBlockedState] = useState(false);
  const [drawingType, setDrawingType] = useState("");
  const { clear } = useControls();
  const {
    currentMazeAlgorithm,
    setCurrentMazeAlgorithm,
    currentAnimationStyle,
    currentAlgorithm,
    setCurrentAlgorithm,
    animationSpeed,
    setAlgoStats,
  } = useAlgorithm();

  useEffect(() => {
    nodes = populateNodes();
    setAlgoStats({ distance: 0, numberOfVisited: 0, timeTaken: 0 });
    setCurrentAlgorithm("None");
  }, [clear, setAlgoStats, setCurrentAlgorithm]);

  //Generating maze
  useEffect(() => {
    switch (currentMazeAlgorithm) {
      case "Recursive backtracking":
        setCurrentMazeAlgorithm("Default");
        setCurrentAlgorithm("None");
        generateMaze(currentMazeAlgorithm);
        break;
      case "Random maze":
        setCurrentMazeAlgorithm("Default");
        setCurrentAlgorithm("None");
        generateMaze(currentMazeAlgorithm);
        break;
      default:
    }
  }, [currentMazeAlgorithm]);

  //Executing pathfinding algorithms
  useEffect(() => {
    clearPaths();
    let currentAlgoNodes;
    switch (currentAlgorithm) {
      case "Dijkstra's algorithm":
        currentAlgoNodes = dijkstra(nodes);
        break;
      case "A* search":
        currentAlgoNodes = astar(nodes);
        break;
      case "Breadth first search":
        currentAlgoNodes = breadth(nodes);
        break;
      case "Best first search":
        currentAlgoNodes = best(nodes);
        break;
      case "Depth first search":
        currentAlgoNodes = depth(nodes);
        break;
      default:
    }

    if (currentAlgoNodes) {
      setAlgoStats(currentAlgoNodes.statistics);
      animateAlgo(currentAlgoNodes, 2);
    }
  }, [currentAlgorithm]);

  const updateNodes = (col, row, type, prevType = type) => {
    const node = nodes[row][col];
    const newNode = { ...node, type: type, prevType: prevType };
    nodes[row][col] = newNode;
    document.getElementById(`node-${row}-${col}`).className = type;
  };

  const moveStartEnd = (row, col, prevRow, prevCol, type) => {
    const newNode = nodes[row][col];
    const prevNode = nodes[prevRow][prevCol];
    const newUpdatedNode = { ...newNode, type: type, prevType: newNode.type };
    if (prevNode.type === "start" || prevNode.type === "end") {
      const prevUpdatedNode = { ...prevNode, type: prevNode.prevType, prevType: "clear" };
      nodes[prevRow][prevCol] = prevUpdatedNode;
    } else {
      nodes[prevRow][prevCol] = { ...prevNode, type: prevNode.prevType };
    }
    nodes[row][col] = newUpdatedNode;
    let currentAlgoNodes;
    switch (currentAlgorithm) {
      case "Dijkstra's algorithm":
        clearPaths();
        currentAlgoNodes = dijkstra(nodes);
        setAlgoStats(currentAlgoNodes.statistics);
        break;
      case "A* search":
        clearPaths();
        currentAlgoNodes = astar(nodes);
        setAlgoStats(currentAlgoNodes.statistics);
        break;
      case "Breadth first search":
        clearPaths();
        currentAlgoNodes = breadth(nodes);
        setAlgoStats(currentAlgoNodes.statistics);
        break;
      case "Best first search":
        clearPaths();
        currentAlgoNodes = best(nodes);
        setAlgoStats(currentAlgoNodes.statistics);
        break;
      case "Depth first search":
        clearPaths();
        currentAlgoNodes = depth(nodes);
        setAlgoStats(currentAlgoNodes.statistics);
        break;
      default:
    }

    if (currentAlgoNodes) {
      if (currentAlgoNodes.nodesOrder !== 0) {
        animateAlgo(currentAlgoNodes, 0);
      }
    }
  };

  const animateAlgo = (stack, time) => {
    setIsInBlockedState(true);
    const { nodesOrder, pathOrder } = stack;

    //Used to move around end and start node
    if (time === 0) {
      nodesOrder.forEach((currNode, indx) => {
        document.getElementById(`node-${currNode.row}-${currNode.column}`).className = `${nodeStyles.visited}`;

        nodes[currNode.row][currNode.column] = {
          ...currNode,
          type: "visited",
        };
        if (nodesOrder.length === indx + 1) {
          // setNodes(newNodes);
          if (pathOrder.length === 0) {
            setIsInBlockedState(false);
          } else animatePath(pathOrder, time);
        }
      });
    } else
      nodesOrder.forEach((currNode, indx) => {
        setTimeout(() => {
          document.getElementById(`node-${currNode.row}-${currNode.column}`).className = `${nodeStyles.visited}`;

          nodes[currNode.row][currNode.column] = {
            ...currNode,
            type: "visited",
          };
          if (nodesOrder.length === indx + 1) {
            // setNodes(newNodes);
            if (pathOrder.length === 0) {
              setIsInBlockedState(false);
            } else animatePath(pathOrder, nodes, time);
          }
        }, time * indx);
      });
  };

  const animatePath = (stack, time) => {
    if (time === 0) {
      stack.forEach((currNode, indx) => {
        document.getElementById(`node-${currNode.row}-${currNode.column}`).className = `${nodeStyles.path}`;
        nodes[currNode.row][currNode.column].type = "path";
        if (stack.length === indx + 1) {
          // setNodes(nooods);
          setIsInBlockedState(false);
        }
      });
    } else
      stack.forEach((currNode, indx) => {
        setTimeout(() => {
          document.getElementById(`node-${currNode.row}-${currNode.column}`).className = `${nodeStyles.path}`;
          nodes[currNode.row][currNode.column].type = "path";
          if (stack.length === indx + 1) {
            // setNodes(nooods);
            setIsInBlockedState(false);
          }
        }, 20 * indx);
      });
  };

  const generateMaze = (currentMazeAlgorithm) => {
    let stack = [];
    debugger;
    switch (currentMazeAlgorithm) {
      case "Recursive backtracking":
        clearPaths();
        stack = recursive(nodes);
        break;
      case "Random maze":
        clearPaths();
        stack = randomMaze(nodes);
        break;
      default:
    }

    if (currentAnimationStyle === "Classic") {
      classicMazeAnimation(stack);
    } else eduMazeAnimation(stack);
  };

  const eduMazeAnimation = (stack) => {
    setIsInBlockedState(true);

    //Transform all nodes to wall type
    for (let row = 0; row < nodes.length; row++) {
      for (let column = 0; column < nodes[0].length; column++) {
        const currentNode = nodes[row][column];
        if (!(currentNode.type === "start" || currentNode.type === "end")) {
          document.getElementById(`node-${currentNode.row}-${currentNode.column}`).className = `${nodeStyles.wall}`;
          nodes[row][column] = { ...nodes[row][column], type: "wall" };
        }
      }
    }

    stack.forEach((currNode, indx) => {
      const { node, type } = currNode;
      const nodeType = nodes[node.row][node.column].type;
      if (animationSpeed === 0) {
        if (!(nodeType === "start" || nodeType === "end")) {
          nodes[node.row][node.column].type = "clear";
          setIsInBlockedState(false);
        }
      } else {
        setTimeout(() => {
          if (!(nodeType === "start" || nodeType === "end")) {
            if (type === "clear") {
              document.getElementById(`node-${node.row}-${node.column}`).className = `${nodeStyles.clear}`;
              nodes[node.row][node.column].type = "clear";
            } else {
              document.getElementById(`node-${node.row}-${node.column}`).className = `${nodeStyles.visited}`;
              nodes[node.row][node.column].type = "visited";
            }
          }
          if (stack.length === indx + 1) {
            setIsInBlockedState(false);
          }
        }, 1000 + indx * animationSpeed);
      }
    });
  };

  const classicMazeAnimation = (stack) => {
    setIsInBlockedState(true);
    //TODO: FIX THAT SHIT
    const onlyWalls = nodes.flat().filter((arrNode) => {
      let x = true;
      stack.forEach((stackElem) => {
        const { node } = stackElem;
        if (node.id === arrNode.id) x = false;
      });
      return x;
    });

    for (let row = 0; row < nodes.length; row++) {
      for (let column = 0; column < nodes[0].length; column++) {
        const currentNode = nodes[row][column];
        if (!(currentNode.type === "start" || currentNode.type === "end")) {
          document.getElementById(`node-${currentNode.row}-${currentNode.column}`).className = `${nodeStyles.clear}`;
          nodes[row][column] = { ...nodes[row][column], type: "clear" };
        }
      }
    }

    onlyWalls.forEach((currNode, indx) => {
      setTimeout(() => {
        if (!(currNode.type === "start" || currNode.type === "end")) {
          document.getElementById(`node-${currNode.row}-${currNode.column}`).className = `${nodeStyles.wall}`;

          nodes[currNode.row][currNode.column].type = "wall";
        }
        if (onlyWalls.length === indx + 1) {
          setTimeout(() => {
            // setNodes(nooods);
            setIsInBlockedState(false);
          }, 500);
        }
      }, indx * animationSpeed);
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
                  setPreviousNode={setPreviousNode}
                  previousNode={previousNode}
                  isInBlockedState={isInBlockedState}
                  updateNodes={updateNodes}
                  onMoveStartEnd={moveStartEnd}
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
