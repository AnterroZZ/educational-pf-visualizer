import { populateNodes } from "../MainPage/MainPage";

function Neighbour(row, column) {
  return {
    row: row,
    column: column,
  };
}
export async function recursiveBacktracking(nodes, setNodes) {
  //Walls around grid
  setNodes(populateNodes());
  const searchNodes = [];
  setNodes(setNeighbours(nodes));
  for (let row = 0; row < 21; row++) {
    for (let column = 0; column < 51; column++) {
      if (
        !(
          nodes[row][column].type === "start" ||
          nodes[row][column].type === "end"
        )
      ) {
        if (row === 0 || row === 20 || column === 0 || column === 50) {
          setNodes(updateNodes(nodes, column, row, "wall", "clear"));
        }
        if (row % 2 === 0 || (row % 2 === 1 && column % 2 === 0)) {
          setNodes(updateNodes(nodes, column, row, "wall", "clear"));
        }
        if (isMazeNode(row, column)) searchNodes.push(nodes[row][column]);
      }
    }
  }

  const startingNode =
    searchNodes[Math.floor(Math.random() * searchNodes.length)];

  recursiveBacktrackingIterative(startingNode, nodes, setNodes);
}

const recursiveBacktrackingIterative = (startingNode, nodes, setNodes) => {
  const stack = [];
  const stack2 = [];
  markAsVisited(startingNode.row, startingNode.column, nodes, setNodes, true);
  stack.push(startingNode);
  while (stack.length > 0) {
    let currentNode = stack.pop();

    let unvisited = currentNode.neighbours.filter((neighbour) => {
      return nodes[neighbour.row][neighbour.column].type !== "visited";
    });
    if (unvisited.length > 0) {
      stack.push(currentNode);
      let next = unvisited[Math.floor(Math.random() * unvisited.length)];
      stack2.push(deleteWallBetween(currentNode, next, nodes, setNodes));
      markAsVisited(next.row, next.column, nodes, setNodes, true);
      stack.push(nodes[next.row][next.column]);
    } else {
      stack2.push(currentNode);
    }
  }
  markAsUnvisited(stack2, nodes, setNodes);
};

const deleteWallBetween = (curr, next, nodes, setNodes) => {
  const newNodes = nodes.slice();
  let foundRow = 0;
  let foundCol = 0;
  if (curr.row < next.row) {
    foundRow = curr.row + 1;
    foundCol = curr.column;
  } else if (curr.row > next.row) {
    foundRow = curr.row - 1;
    foundCol = curr.column;
  } else if (curr.column < next.column) {
    foundRow = curr.row;
    foundCol = curr.column + 1;
  } else {
    foundRow = curr.row;
    foundCol = curr.column - 1;
  }
  const foundNode = nodes[foundRow][foundCol];
  const newFoundNode = { ...foundNode, type: "visited", prevType: "clear" };
  newNodes[foundRow][foundCol] = newFoundNode;
  setNodes(newNodes);
  return newFoundNode;
};

const markAsUnvisited = (stack, nodes, setNodes) => {
  const newNodes = nodes.slice();
  stack.map((node) => {
    const currNode = nodes[node.row][node.column];
    const newNode = { ...currNode, type: "clear", prevType: "clear" };
    newNodes[node.row][node.column] = newNode;
  });

  setNodes(newNodes);
};
const markAsVisited = (row, column, nodes, setNodes) => {
  const newNodes = nodes.slice();
  const currNode = nodes[row][column];
  const newNode = { ...currNode, type: "visited", prevType: "clear" };
  newNodes[row][column] = newNode;
  setNodes(newNodes);
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const updateNodes = (nodes, col, row, type, prevType = type) => {
  const newNodes = nodes.slice();
  const node = nodes[row][col];
  const newNode = { ...node, type: type, prevType: prevType };
  newNodes[row][col] = newNode;
  return newNodes;
};

const setNeighbours = (nodes) => {
  const nrRows = nodes.length;
  const nrColumns = nodes[0].length;
  const newNodes = nodes.slice();
  for (let r = 0; r < nrRows; r++) {
    for (let c = 0; c < nrColumns; c++) {
      if (isMazeNode(r, c)) {
        const neighbours = addNeighbours(r, c, nrRows, nrColumns);
        const currNode = nodes[r][c];
        const newNode = { ...currNode, neighbours: neighbours };
        newNodes[r][c] = newNode;
      }
    }
  }
  return newNodes;
};

const isMazeNode = (row, col) => {
  return row % 2 === 1 && col % 2 === 1;
};

const addNeighbours = (row, col, maxRow, maxCol) => {
  const neighbours = [];
  if (row - 2 > 0) neighbours.push(Neighbour(row - 2, col));
  if (row + 2 < maxRow - 1) neighbours.push(Neighbour(row + 2, col));
  if (col - 2 > 0) neighbours.push(Neighbour(row, col - 2));
  if (col + 2 < maxCol - 1) neighbours.push(Neighbour(row, col + 2));

  return neighbours;
};
