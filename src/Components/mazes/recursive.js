function Neighbour(row, column) {
  return {
    row: row,
    column: column,
  };
}

export function recursive(nodes) {
  const newNodeee = JSON.parse(JSON.stringify(nodes));
  let algoNodes = setNeighbours(newNodeee);
  const startingNode = pickRandomFirstNode(algoNodes);
  const nodesOrder = [];
  const algoStack = [];

  markAsFound(startingNode.row, startingNode.column);
  const newStarterParams = notifyVisited(startingNode, algoNodes);
  algoNodes = newStarterParams.nodes;
  nodesOrder.push(markAsFound(newStarterParams.newNode));
  algoStack.push(newStarterParams.newNode);

  while (algoStack.length > 0) {
    let currentNode = algoStack.pop();
    const unvisited = currentNode.neighbours.filter(
      (neighbour) =>
        algoNodes[neighbour.row][neighbour.column].type !== "visited"
    );

    if (unvisited.length > 0) {
      const neighbour = randomOne(unvisited);
      algoStack.push(currentNode);
      const nextNode = algoNodes[neighbour.row][neighbour.column];
      const wallNode = findNodeBetween(currentNode, nextNode, algoNodes);
      nodesOrder.push(markAsFound(wallNode));
      nodesOrder.push(markAsFound(nextNode));
      const newParams = notifyVisited(nextNode, algoNodes);
      algoNodes = newParams.nodes;
      algoStack.push(newParams.newNode);
    } else {
      //In future to be controlled by variable if visited nodes want to be seen by user
      if (true) {
        nodesOrder.push(markAsVisited(currentNode));
        if (algoStack.length !== 0) {
          const previousNode = algoStack.pop();
          const wallNode = findNodeBetween(
            previousNode,
            currentNode,
            algoNodes
          );
          nodesOrder.push(markAsVisited(wallNode));
          algoStack.push(previousNode);
        }
      }
    }
  }

  return nodesOrder;
}

const notifyVisited = (node, nodes) => {
  let newNode = { ...node, type: "visited" };
  nodes[node.row][node.column] = newNode;
  return { nodes, newNode };
};
const findNodeBetween = (nodeOne, nodeTwo, nodes) => {
  let foundRow = 0;
  let foundColumn = 0;
  if (nodeOne.row < nodeTwo.row) {
    foundRow = nodeOne.row + 1;
    foundColumn = nodeOne.column;
  } else if (nodeOne.row > nodeTwo.row) {
    foundRow = nodeOne.row - 1;
    foundColumn = nodeOne.column;
  } else if (nodeOne.column < nodeTwo.column) {
    foundRow = nodeOne.row;
    foundColumn = nodeOne.column + 1;
  } else {
    foundRow = nodeOne.row;
    foundColumn = nodeOne.column - 1;
  }

  const foundNode = nodes[foundRow][foundColumn];
  return foundNode;
};
const randomOne = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const setNeighbours = (nodes) => {
  const nrRows = nodes.length;
  const nrColumns = nodes[0].length;
  for (let r = 0; r < nrRows; r++) {
    for (let c = 0; c < nrColumns; c++) {
      if (isMazeNode(r, c)) {
        const neighbours = addNeighbours(r, c, nrRows, nrColumns);
        const currNode = nodes[r][c];
        const newNode = { ...currNode, neighbours: neighbours };
        nodes[r][c] = newNode;
      }
    }
  }
  return nodes;
};

const addNeighbours = (row, col, maxRow, maxCol) => {
  const neighbours = [];
  if (row - 2 > 0) neighbours.push(Neighbour(row - 2, col));
  if (row + 2 < maxRow - 1) neighbours.push(Neighbour(row + 2, col));
  if (col - 2 > 0) neighbours.push(Neighbour(row, col - 2));
  if (col + 2 < maxCol - 1) neighbours.push(Neighbour(row, col + 2));

  return neighbours;
};

const markAsFound = (node, nodes) => {
  return { node: node, type: "clear" };
};

const markAsVisited = (node, nodes) => {
  return { node: node, type: "visited" };
};

const pickRandomFirstNode = (nodes) => {
  const mazeNodes = [];
  for (let row = 0; row < nodes.length; row++) {
    for (let column = 0; column < nodes[0].length; column++) {
      if (isMazeNode(row, column)) mazeNodes.push(nodes[row][column]);
    }
  }

  return randomOne(mazeNodes);
};

const isMazeNode = (row, col) => {
  return row % 2 === 1 && col % 2 === 1;
};
