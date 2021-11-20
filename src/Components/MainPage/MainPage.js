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

// Node types are: clear, wall, start, end, visited
function singleNode(id, row, column) {
  return {
    id: id,
    row: row,
    column: column,
    type: "clear",
    prevType: "clear",
    neighbours: [],
    distance: Number.POSITIVE_INFINITY,
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

const clearPaths = (allNodes) => {
  const workOnNodes = JSON.parse(JSON.stringify(allNodes));
  for (let row = 0; row < workOnNodes.length; row++) {
    for (let column = 0; column < workOnNodes[0].length; column++) {
      const currentNode = workOnNodes[row][column];
      if (currentNode.type === "visited" || currentNode.type === "path") {
        workOnNodes[row][column] = {
          ...currentNode,
          type: "clear",
          distance: Infinity,
        };
      }
    }
  }

  return workOnNodes;
};

const MainPage = () => {
  const [nodes, setNodes] = useState(populateNodes());
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
  } = useAlgorithm();

  useEffect(() => {
    setNodes(populateNodes());
    setCurrentAlgorithm("None");
  }, [clear]);

  //Generating maze
  useEffect(() => {
    switch (currentMazeAlgorithm) {
      case "Recursive backtracking":
        setCurrentMazeAlgorithm("Default");
        setCurrentAlgorithm("None");
        generateMaze(currentMazeAlgorithm, nodes);
        break;
      case "Random maze":
        setCurrentMazeAlgorithm("Default");
        setCurrentAlgorithm("None");
        generateMaze(currentMazeAlgorithm, nodes);
        break;
      default:
        console.log("No such maze generating algo!");
    }
  }, [currentMazeAlgorithm]);

  //Executing pathfinding algorithms
  useEffect(() => {
    setNodes(clearPaths(nodes));
    const copyOfNodes = clearPaths(JSON.parse(JSON.stringify(nodes)));
    switch (currentAlgorithm) {
      case "Dijkstra's algorithm":
        const dijkstraNodes = dijkstra(copyOfNodes);
        animateAlgo(dijkstraNodes, copyOfNodes, 2);
        break;
      case "A* search":
        const astarNodes = astar(copyOfNodes);
        animateAlgo(astarNodes, copyOfNodes, 4);
        break;
      case "Breadth first search":
        const breadthNodes = breadth(copyOfNodes);
        animateAlgo(breadthNodes, copyOfNodes, 2);
        break;
      case "Best first search":
        const bestNodes = best(copyOfNodes);
        animateAlgo(bestNodes, copyOfNodes, 2);
        break;
    }
  }, [currentAlgorithm]);

  const updateNodes = (nodes, col, row, type, prevType = type) => {
    const newNodes = JSON.parse(JSON.stringify(nodes));
    const node = nodes[row][col];
    const newNode = { ...node, type: type, prevType: prevType };
    newNodes[row][col] = newNode;
    setNodes(newNodes);
  };

  const moveStartEnd = (row, col, prevRow, prevCol, type) => {
    let copyOfNodes = JSON.parse(JSON.stringify(nodes));
    const newNode = copyOfNodes[row][col];
    const prevNode = copyOfNodes[prevRow][prevCol];
    const newUpdatedNode = { ...newNode, type: type, prevType: newNode.type };
    const prevUpdatedNode = { ...prevNode, type: prevNode.prevType };
    copyOfNodes[row][col] = newUpdatedNode;
    copyOfNodes[prevRow][prevCol] = prevUpdatedNode;
    switch (currentAlgorithm) {
      case "Dijkstra's algorithm":
        copyOfNodes = clearPaths(copyOfNodes);
        const dijkstraNodes = dijkstra(copyOfNodes);
        animateAlgo(dijkstraNodes, copyOfNodes, 0);
        break;
      case "A* search":
        copyOfNodes = clearPaths(copyOfNodes);
        const astarNodes = astar(copyOfNodes);
        animateAlgo(astarNodes, copyOfNodes, 0);
        break;
      case "Breadth first search":
        copyOfNodes = clearPaths(copyOfNodes);
        const breadthNodes = breadth(copyOfNodes);
        animateAlgo(breadthNodes, copyOfNodes, 0);
        break;
      case "Best first search":
        copyOfNodes = clearPaths(copyOfNodes);
        const bestNodes = best(copyOfNodes);
        animateAlgo(bestNodes, copyOfNodes, 0);
        break;
      default:
        setNodes(copyOfNodes);
    }
  };

  const animateAlgo = (stack, currentNodes, time) => {
    setIsInBlockedState(true);
    const { nodesOrder, pathOrder, statistics } = stack;
    console.log(statistics);
    const newNodes = JSON.parse(JSON.stringify(currentNodes));

    //Used to move around end and start node
    if (time === 0) {
      nodesOrder.forEach((currNode, indx) => {
        document.getElementById(`node-${currNode.row}-${currNode.column}`).className = `${nodeStyles.visited}`;

        newNodes[currNode.row][currNode.column] = {
          ...currNode,
          type: "visited",
        };
        if (nodesOrder.length === indx + 1) {
          setNodes(newNodes);
          if (pathOrder.length === 0) {
            setIsInBlockedState(false);
          } else animatePath(pathOrder, newNodes, time);
        }
      });
    } else
      nodesOrder.forEach((currNode, indx) => {
        setTimeout(() => {
          document.getElementById(`node-${currNode.row}-${currNode.column}`).className = `${nodeStyles.visited}`;

          newNodes[currNode.row][currNode.column] = {
            ...currNode,
            type: "visited",
          };
          if (nodesOrder.length === indx + 1) {
            setNodes(newNodes);
            if (pathOrder.length === 0) {
              setIsInBlockedState(false);
            } else animatePath(pathOrder, newNodes, time);
          }
        }, time * indx);
      });
  };

  const animatePath = (stack, currentNodes, time) => {
    const nooods = JSON.parse(JSON.stringify(currentNodes));
    if (time === 0) {
      stack.forEach((currNode, indx) => {
        document.getElementById(`node-${currNode.row}-${currNode.column}`).className = `${nodeStyles.path}`;
        nooods[currNode.row][currNode.column].type = "path";
        if (stack.length === indx + 1) {
          setNodes(nooods);
          setIsInBlockedState(false);
        }
      });
    } else
      stack.forEach((currNode, indx) => {
        setTimeout(() => {
          document.getElementById(`node-${currNode.row}-${currNode.column}`).className = `${nodeStyles.path}`;
          nooods[currNode.row][currNode.column].type = "path";
          if (stack.length === indx + 1) {
            setNodes(nooods);
            setIsInBlockedState(false);
          }
        }, 20 * indx);
      });
  };

  const generateMaze = (currentMazeAlgorithm, nodes) => {
    let stack = [];
    switch (currentMazeAlgorithm) {
      case "Recursive backtracking":
        stack = recursive(clearPaths(nodes));
        break;
      case "Random maze":
        stack = randomMaze(clearPaths(nodes));
        break;
      default:
        console.log("No such maze generating algo!");
    }

    if (currentAnimationStyle === "Classic") {
      classicMazeAnimation(stack);
    } else eduMazeAnimation(stack);
  };

  const eduMazeAnimation = (stack) => {
    setIsInBlockedState(true);
    const newNodesAnim = JSON.parse(JSON.stringify(nodes));
    const newNodes = JSON.parse(JSON.stringify(nodes));

    //Transform all nodes to wall type
    for (let row = 0; row < nodes.length; row++) {
      for (let column = 0; column < nodes[0].length; column++) {
        const currentNode = newNodes[row][column];
        if (!(currentNode.type === "start" || currentNode.type === "end")) {
          document.getElementById(`node-${currentNode.row}-${currentNode.column}`).className = `${nodeStyles.wall}`;
          newNodes[row][column] = { ...nodes[row][column], type: "wall" };
        }
      }
    }

    stack.forEach((currNode, indx) => {
      const { node, type } = currNode;
      const nodeType = newNodesAnim[node.row][node.column].type;
      if (animationSpeed === 0) {
        if (!(nodeType === "start" || nodeType === "end")) {
          newNodes[node.row][node.column].type = "clear";
          setNodes(newNodes);
          setIsInBlockedState(false);
        }
      } else {
        setTimeout(() => {
          if (!(nodeType === "start" || nodeType === "end")) {
            if (type === "clear") {
              document.getElementById(`node-${node.row}-${node.column}`).className = `${nodeStyles.node}`;
              newNodesAnim[node.row][node.column].type = "clear";
            } else {
              document.getElementById(`node-${node.row}-${node.column}`).className = `${nodeStyles.visited}`;
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
        }, 1000 + indx * animationSpeed);
      }
    });
  };

  const classicMazeAnimation = (stack) => {
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
          document.getElementById(`node-${currentNode.row}-${currentNode.column}`).className = `${nodeStyles.node}`;
          nooods[row][column] = { ...nodes[row][column], type: "clear" };
        }
      }
    }

    onlyWalls.forEach((currNode, indx) => {
      setTimeout(() => {
        if (!(currNode.type === "start" || currNode.type === "end")) {
          document.getElementById(`node-${currNode.row}-${currNode.column}`).className = `${nodeStyles.wall}`;

          nooods[currNode.row][currNode.column].type = "wall";
        }
        if (onlyWalls.length === indx + 1) {
          setTimeout(() => {
            setNodes(nooods);
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
                  setNodes={setNodes}
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
