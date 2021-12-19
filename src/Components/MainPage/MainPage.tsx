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
      case "Recursive division":
        setCurrentMazeAlgorithm("Default");
        setCurrentAlgorithm("None");
        generateMaze(currentMazeAlgorithm);
        break;
      default:
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

    //Used to move around end and start node
    if (nodesOrder !== undefined) {
      if (time === 0) {
        nodesOrder.forEach((currNode: SingleNode, indx: number) => {
          document.getElementById(`node-${currNode.row}-${currNode.column}`)!.className = `${nodeStyles.visited}`;

          nodes[currNode.row][currNode.column] = {
            ...currNode,
            type: "visited",
          };
          if (nodesOrder.length === indx + 1) {
            // setNodes(newNodes);
            if (pathOrder !== undefined) {
              if (pathOrder.length === 0) {
                setIsInBlockedState(false);
              } else animatePath(pathOrder, time);
            }
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
              // setNodes(newNodes);
              if (pathOrder !== undefined) {
                if (pathOrder.length === 0) {
                  setIsInBlockedState(false);
                } else animatePath(pathOrder, time);
              }
            }
          }, time * indx);
        });
    }
  };

  const animatePath = (stack: NodeInterface[], time: number) => {
    if (time === 0) {
      stack.forEach((currNode, indx) => {
        document.getElementById(`node-${currNode.row}-${currNode.column}`)!.className = `${nodeStyles.path}`;
        nodes[currNode.row][currNode.column].type = "path";
        if (stack.length === indx + 1) {
          // setNodes(nooods);
          setIsInBlockedState(false);
        }
      });
    } else
      stack.forEach((currNode, indx) => {
        setTimeout(() => {
          document.getElementById(`node-${currNode.row}-${currNode.column}`)!.className = `${nodeStyles.path}`;
          nodes[currNode.row][currNode.column].type = "path";
          if (stack.length === indx + 1) {
            // setNodes(nooods);
            setIsInBlockedState(false);
          }
        }, 20 * indx);
      });
  };

  const generateMaze = (currentMazeAlgorithm: string) => {
    let stack: WrapperNode[] = [];
    let type: string = "clear";
    switch (currentMazeAlgorithm) {
      case "Recursive backtracking":
        clearPaths();
        stack = randomDepth(nodes);
        type = "clear";
        break;
      case "Random maze":
        clearPaths();
        stack = randomMaze(nodes);
        type = "clear";
        break;
      case "Recursive division":
        clearPaths();
        nodes = clearWalls(nodes);
        stack = wallsAround(nodes);
        stack.push(...recursive(nodes.flat()));
        type = "wall";
        break;
      default:
    }

    if (currentAnimationStyle === "Classic") {
      classicMazeAnimation(stack, type);
    } else {
      if (type === "clear") {
        nodes = allWalls(nodes);
        eduMazeAnimation(stack, type);
      } else if (type === "wall") {
        eduMazeAnimation(stack, type);
      }
    }
  };

  const executePathFinding = (time: number) => {
    let currentAlgoNodes: algorithmStack | undefined = undefined;
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

    if (currentAlgoNodes !== undefined) {
      if (currentAlgoNodes.nodesOrder !== undefined) {
        animateAlgo(currentAlgoNodes, time);
      }
    }
  };

  const eduMazeAnimation = (stack: WrapperNode[], eduMazeAnimationType: string) => {
    setIsInBlockedState(true);

    //Transform all nodes to wall type

    stack.forEach((currNode, indx) => {
      const { node, type } = currNode;
      const nodeType = nodes[node.row][node.column].type;
      if (mazeAnimationSpeed === 0) {
        if (!(nodeType === "start" || nodeType === "end")) {
          nodes[node.row][node.column].type = eduMazeAnimationType;
          setIsInBlockedState(false);
        }
      } else {
        setTimeout(() => {
          if (!(nodeType === "start" || nodeType === "end")) {
            if (type === "clear") {
              document.getElementById(`node-${node.row}-${node.column}`)!.className = `${nodeStyles.clear}`;
              nodes[node.row][node.column].type = "clear";
            } else if (type === "wall") {
              document.getElementById(`node-${node.row}-${node.column}`)!.className = `${nodeStyles.wall}`;
              nodes[node.row][node.column].type = "wall";
            } else {
              document.getElementById(`node-${node.row}-${node.column}`)!.className = `${nodeStyles.visited}`;
              nodes[node.row][node.column].type = "visited";
            }
          }
          if (stack.length === indx + 1) {
            setIsInBlockedState(false);
          }
        }, indx * mazeAnimationSpeed);
      }
    });
  };

  const classicMazeAnimation = (stack: WrapperNode[], type: string) => {
    setIsInBlockedState(true);
    let onlyWalls;
    if (type === "clear") {
      onlyWalls = nodes.flat().filter((arrNode) => {
        let x = true;
        stack.forEach((stackElem) => {
          const { node } = stackElem;
          if (node.id === arrNode.id) x = false;
        });
        return x;
      });
    } else {
      onlyWalls = nodes.flat().filter((arrNode) => {
        let x = false;
        debugger;
        for (let i = 0; i < stack.length; i++) {
          const { node } = stack[i];
          if (node.id === arrNode.id) {
            x = true;
            break;
          }
        }
        return x;
      });
    }

    clearWalls(nodes);

    onlyWalls.forEach((currNode, indx) => {
      setTimeout(() => {
        if (!(currNode.type === "start" || currNode.type === "end")) {
          document.getElementById(`node-${currNode.row}-${currNode.column}`)!.className = `${nodeStyles.wall}`;

          nodes[currNode.row][currNode.column].type = "wall";
        }
        if (onlyWalls.length === indx + 1) {
          setIsInBlockedState(false);
        }
      }, indx * mazeAnimationSpeed);
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
