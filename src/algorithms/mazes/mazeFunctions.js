import nodeStyles from "../../Components/MainPage/Nodes/Node.module.css";
import { randomMaze } from "./random";
import { recursive } from "./recursive";

export function generateMaze(mazeAlgorithm, nodes, animationStyle) {
  const workOnNodes = JSON.parse(JSON.stringify(nodes));
  let stack = [];
  switch (mazeAlgorithm) {
    case "Recursive backtracking":
      stack = recursive(workOnNodes);
      break;
    case "Random maze":
      stack = randomMaze(workOnNodes);
      break;
    default:
      console.log("No such maze generating algo!");
  }
  if (stack.length !== 0) {
    if (animationStyle === "Classic") {
      return classicMazeAnimation(stack, workOnNodes);
    } else return eduMazeAnimation(stack, nodes);
  }
}

const eduMazeAnimation = (stack, nodes) => {
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
        return newNodes;
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
            return newNodes;
          }, 500);
        }
      }, 1000 + indx * mazeAnimationSpeed);
    }
  });
};

const classicMazeAnimation = async (stack, nodes) => {
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
      if (onlyWalls.length === indx + 1) {
        return nooods;
      }
    }, indx * 5);
  });
};
