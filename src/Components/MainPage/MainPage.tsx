import Node from "./Nodes/Node";
import styles from "./MainPage.module.css";
import nodeStyles from "./Nodes/Node.module.css";
import { useEffect, useState } from "react";
import { useControls } from "../Contex/ControlsContext";
import { useAlgorithm } from "../Contex/AlgorithmsContext";
import { randomDepth } from "../../algorithms/mazes/randomDepth";
import { randomMaze } from "../../algorithms/mazes/random";
import { dijkstra } from "../../algorithms/pathfinding/dijkstra";
import { astar } from "../../algorithms/pathfinding/astar";
import { breadth } from "../../algorithms/pathfinding/breadth";
import { best } from "../../algorithms/pathfinding/best";
import { depth } from "../../algorithms/pathfinding/depth";
import { recursive } from "../../algorithms/mazes/recursive";
import { Node as NodeInterface } from "../../algorithms/pathfinding/pathfindingUtils";
import { WrapperNode } from "../../algorithms/mazes/randomDepth";

// Node types are: clear, wall, start, end, visited
interface algorithmStack {
  nodesOrder: NodeInterface[] | undefined;
  pathOrder: NodeInterface[] | undefined;
  statistics: {
    distance: number;
    numberOfVisited: number;
    timeTaken: number;
  };
}

export class SingleNode implements NodeInterface {
  id: number;
  row: number;
  column: number;
  type: string;
  prevType: string;
  neighbours: NodeInterface[];
  distance: number;
  constructor(id: number, row: number, column: number) {
    this.id = id;
    this.row = row;
    this.column = column;
    this.type = "clear";
    this.prevType = "clear";
    this.neighbours = [];
    this.distance = Infinity;
  }
}

const wallsAround = (nodes: SingleNode[][]) => {
  const helpingStack = [];
  for (let row = 0; row < nodes.length; row++) {
    for (let column = 0; column < nodes[0].length; column++) {
      if (row === 0 || row === nodes.length - 1 || column === 0 || column === nodes[0].length - 1) {
        helpingStack.push({ node: nodes[row][column], type: "wall" });
      }
    }
  }
  return helpingStack;
};

const allWalls = (nodes: SingleNode[][]) => {
  for (let row = 0; row < nodes.length; row++) {
    for (let column = 0; column < nodes[0].length; column++) {
      const currentNode = nodes[row][column];
      if (!(currentNode.type === "start" || currentNode.type === "end")) {
        document.getElementById(`node-${currentNode.row}-${currentNode.column}`)!.className = `${nodeStyles.wall}`;
        nodes[row][column] = { ...nodes[row][column], type: "wall" };
      }
    }
  }

  return nodes;
};

const populateNodes = () => {
  let nodes: SingleNode[][] = [];
  for (let row = 0; row < 21; row++) {
    let currentRow: SingleNode[] = [];
    for (let column = 0; column < 51; column++) {
      const node: SingleNode = new SingleNode(row * 51 + column, row, column);
      if (column === 11 && row === 11) node.type = "start";
      if (column === 39 && row === 11) node.type = "end";
      currentRow.push(node);
    }
    nodes.push(currentRow);
  }
  return nodes;
};

const clearWalls = (nodes: SingleNode[][]) => {
  for (let row = 0; row < nodes.length; row++) {
    for (let column = 0; column < nodes[0].length; column++) {
      if (nodes[row][column].type === "wall") {
        nodes[row][column].type = "clear";
      }
    }
  }

  return nodes;
};

let nodes: SingleNode[][] = populateNodes();

const clearPaths = () => {
  for (let row = 0; row < nodes.length; row++) {
    for (let column = 0; column < nodes[0].length; column++) {
      const currentNode: SingleNode = nodes[row][column];
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
  const { mainPageCommand, setMainPageCommand, executeAlgo } = useControls();
  const {
    currentMazeAlgorithm,
    setCurrentMazeAlgorithm,
    currentAnimationStyle,
    currentAlgorithm,
    setCurrentAlgorithm,
    mazeAnimationSpeed,
    setAlgoStats,
    algoAnimationSpeed,
    setCompareAlgoData,
  } = useAlgorithm();

  useEffect(() => {
    if (mainPageCommand === "clear") {
      nodes = clearWalls(nodes);
      executePathFinding(0);
      setMainPageCommand("none");
    } else if (mainPageCommand === "reset") {
      nodes = populateNodes();
      setAlgoStats({ distance: 0, numberOfVisited: 0, timeTaken: 0 });
      setCurrentAlgorithm("None");
      setMainPageCommand("none");
    } else if (mainPageCommand === "") {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainPageCommand, setAlgoStats, setCurrentAlgorithm]);

  useEffect(() => {
    clearPaths();
    switch (executeAlgo) {
      case "Dijkstra's algorithm":
        setCompareAlgoData({ name: executeAlgo, data: dijkstra(nodes) });
        break;
      case "A* search":
        setCompareAlgoData({ name: executeAlgo, data: astar(nodes) });
        break;
      case "Breadth first search":
        setCompareAlgoData({ name: executeAlgo, data: breadth(nodes) });
        break;
      case "Best first search":
        setCompareAlgoData({ name: executeAlgo, data: best(nodes) });
        break;
      case "Depth first search":
        setCompareAlgoData({ name: executeAlgo, data: depth(nodes) });
        break;
      default:
    }
  }, [executeAlgo, setCompareAlgoData]);

  //Generating maze
  useEffect(() => {
    if (isValidMazeAlgorithm(currentMazeAlgorithm)) {
      setCurrentMazeAlgorithm("Default");
      setCurrentAlgorithm("None");
      generateMaze(currentMazeAlgorithm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMazeAlgorithm]);

  //Executing pathfinding algorithms
  useEffect(() => {
    executePathFinding(algoAnimationSpeed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAlgorithm]);

  const updateNodes = (col: number, row: number, type: string, prevType = type) => {
    const node: SingleNode = nodes[row][col];
    const newNode: SingleNode = { ...node, type: type, prevType: prevType };
    nodes[row][col] = newNode;
    setCompareAlgoData("clear");
    document.getElementById(`node-${row}-${col}`)!.className = type;
  };

  const moveStartEnd = (row: number, col: number, prevRow: number, prevCol: number, type: string) => {
    const newNode: SingleNode = nodes[row][col];
    const prevNode: SingleNode = nodes[prevRow][prevCol];
    const newUpdatedNode = { ...newNode, type: type, prevType: newNode.type };
    if (prevNode.type === "start" || prevNode.type === "end") {
      const prevUpdatedNode: SingleNode = { ...prevNode, type: prevNode.prevType, prevType: "clear" };
      nodes[prevRow][prevCol] = prevUpdatedNode;
    } else {
      nodes[prevRow][prevCol] = { ...prevNode, type: prevNode.prevType };
    }
    nodes[row][col] = newUpdatedNode;
    executePathFinding(0);
    setCompareAlgoData("clear");
  };

  const animateAlgo = (stack: algorithmStack, time: number) => {
    setIsInBlockedState(true);
    const { nodesOrder, pathOrder } = stack;

    if (nodesOrder === undefined) {
      return;
    }
    if (time === 0) {
      nodesOrder.forEach((currNode: SingleNode, indx: number) => {
        document.getElementById(`node-${currNode.row}-${currNode.column}`)!.className = `${nodeStyles.visited}`;

        nodes[currNode.row][currNode.column] = {
          ...currNode,
          type: "visited",
        };
        if (nodesOrder.length === indx + 1) {
          if (pathOrder === undefined) {
            return;
          }
          if (pathOrder.length === 0) {
            setIsInBlockedState(false);
          }
          animatePath(pathOrder, time);
        }
      });
    } else
      nodesOrder.forEach((currNode, indx) => {
        setTimeout(() => {
          document.getElementById(`node-${currNode.row}-${currNode.column}`)!.className = `${nodeStyles.visited}`;

          nodes[currNode.row][currNode.column] = {
            ...currNode,
            type: "visited",
          };
          if (nodesOrder.length === indx + 1) {
            if (pathOrder === undefined) {
              return;
            }
            if (pathOrder.length === 0) {
              setIsInBlockedState(false);
            } else animatePath(pathOrder, time);
          }
        }, time * indx);
      });
  };

  const animatePath = (stack: NodeInterface[], time: number) => {
    if (time === 0) {
      stack.forEach((currNode, indx) => {
        document.getElementById(`node-${currNode.row}-${currNode.column}`)!.className = `${nodeStyles.path}`;
        nodes[currNode.row][currNode.column].type = "path";
        if (stack.length === indx + 1) {
          setIsInBlockedState(false);
        }
      });
    } else
      stack.forEach((currNode, indx) => {
        setTimeout(() => {
          document.getElementById(`node-${currNode.row}-${currNode.column}`)!.className = `${nodeStyles.path}`;
          nodes[currNode.row][currNode.column].type = "path";
          if (stack.length === indx + 1) {
            setIsInBlockedState(false);
          }
        }, 20 * indx);
      });
  };

  const generateMaze = (currentMazeAlgorithm: string) => {
    let stack: WrapperNode[] = getStackForCurrentAlgorithm(currentMazeAlgorithm);
    clearPaths();

    if (currentAnimationStyle === "Classic") {
      classicMazeAnimation(stack);
    } else {
      eduMazeAnimation(stack);
    }
  };

  const executePathFinding = (time: number) => {
    let currentAlgoNodes: algorithmStack | undefined = undefined;
    clearPaths();
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
    if (currentAlgoNodes === undefined || currentAlgoNodes.nodesOrder === undefined) {
      return;
    }

    setAlgoStats(currentAlgoNodes.statistics);
    animateAlgo(currentAlgoNodes, time);
  };

  const eduMazeAnimation = (stack: WrapperNode[]) => {
    setIsInBlockedState(true);
    nodes = prepareTheBoard(stack);
    animateGrid(stack);
  };

  const classicMazeAnimation = (stack: WrapperNode[]) => {
    setIsInBlockedState(true);
    clearWalls(nodes);
    const wallNodes: WrapperNode[] = getWallNodesFromStack(stack);
    animateGrid(wallNodes);
  };

  function animateGrid(stack: WrapperNode[]) {
    stack.forEach((currNode, indx) => {
      const { node, type: stackNodeType } = currNode;
      const currentNodeType = nodes[node.row][node.column].type;

      setTimeout(() => {
        if (stack.length === indx + 1) {
          setIsInBlockedState(false);
        }
        if (currentNodeType === "start" || currentNodeType === "end") {
          return;
        }
        if (stackNodeType === "clear") {
          document.getElementById(`node-${node.row}-${node.column}`)!.className = `${nodeStyles.clear}`;
          nodes[node.row][node.column].type = "clear";
        } else if (stackNodeType === "wall") {
          document.getElementById(`node-${node.row}-${node.column}`)!.className = `${nodeStyles.wall}`;
          nodes[node.row][node.column].type = "wall";
        } else {
          document.getElementById(`node-${node.row}-${node.column}`)!.className = `${nodeStyles.visited}`;
          nodes[node.row][node.column].type = "visited";
        }
      }, indx * mazeAnimationSpeed);
    });
  }
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

function isValidMazeAlgorithm(mazeAlgorithmName: String) {
  if (
    mazeAlgorithmName === "Recursive backtracking" ||
    mazeAlgorithmName === "Random maze" ||
    mazeAlgorithmName === "Recursive division"
  ) {
    return true;
  }
  return false;
}

function getStackForCurrentAlgorithm(mazeAlgorithmName: String) {
  let stack: WrapperNode[] = [];
  if (mazeAlgorithmName === "Recursive backtracking") {
    stack = randomDepth(nodes);
  }

  if (mazeAlgorithmName === "Random maze") {
    stack = randomMaze(nodes);
  }

  if (mazeAlgorithmName === "Recursive division") {
    stack = wallsAround(nodes);
    stack.push(...recursive(nodes.flat()));
  }

  return stack;
}

function prepareTheBoard(stack: WrapperNode[]) {
  let type: string = stack[0].type;
  if (type === "clear") {
    return allWalls(nodes);
  }

  return clearWalls(nodes);
}

function getWallNodesFromStack(stack: WrapperNode[]) {
  const type: string = stack[0].type;
  const onlyWalls: SingleNode[] = nodes.flat().filter((arrNode) => {
    for (let i = 0; i < stack.length; i++) {
      const { node } = stack[i];
      if (node.id === arrNode.id && type === "clear") return false;
      if (node.id === arrNode.id && type === "wall") return true;
    }
    if (type === "clear") {
      return true;
    } else return false;
  });

  return onlyWalls.map((node) => {
    return { node: node, type: "wall" };
  });
}

export default MainPage;
