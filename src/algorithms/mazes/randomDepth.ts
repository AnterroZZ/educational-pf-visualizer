interface Node {
  id: number;
  row: number;
  column: number;
  type: string;
  prevType: string;
  neighbours: Node[];
  distance: number;
}

export interface WrapperNode {
  node: Node;
  type: string;
}

export function randomDepth(nodes: Node[][]) {
  const newNodeee = JSON.parse(JSON.stringify(nodes));
  let algoNodes: Node[][] = setNeighbours(newNodeee);
  const startingNode = pickRandomFirstNode(algoNodes);
  const nodesOrder: WrapperNode[] = [];
  const algoStack: Node[] = [];

  markAsFound(startingNode);
  const newStarterParams = notifyVisited(startingNode, algoNodes);
  algoNodes = newStarterParams.nodes;
  nodesOrder.push(markAsFound(newStarterParams.newNode));
  algoStack.push(newStarterParams.newNode);

  while (algoStack.length > 0) {
    let currentNode: Node | undefined = algoStack.pop();
    if (currentNode === undefined) {
      break;
    }
    const unvisited = [];
    for (let i = 0; i < currentNode.neighbours.length; i++) {
      if (algoNodes[currentNode.neighbours[i].row][currentNode.neighbours[i].column].type !== "visited") {
        unvisited.push(currentNode.neighbours[i]);
      }
    }

    if (unvisited.length > 0) {
      const neighbour = randomOne(unvisited);
      algoStack.push(currentNode);
      const nextNode: Node = algoNodes[neighbour.row][neighbour.column];
      const wallNode = findNodeBetween(currentNode, nextNode, algoNodes);
      nodesOrder.push(markAsFound(wallNode));
      nodesOrder.push(markAsFound(nextNode));
      const newParams = notifyVisited(nextNode, algoNodes);
      algoNodes = newParams.nodes;
      algoStack.push(newParams.newNode);
      // } else {
      //   //In future to be controlled by variable if visited nodes want to be seen by user
      //     nodesOrder.push(markAsVisited(currentNode));
      //     if (algoStack.length !== 0) {
      //       const previousNode: Node | undefined = algoStack.pop();
      //       if(previousNode === undefined){
      //         break;
      //       }
      //       const wallNode = findNodeBetween(previousNode, currentNode, algoNodes);
      //       nodesOrder.push(markAsVisited(wallNode));
      //       algoStack.push(previousNode);
      //     }
    }
  }

  return nodesOrder;
}

const notifyVisited = (node: Node, nodes: Node[][]) => {
  let newNode: Node = { ...node, type: "visited" };
  nodes[node.row][node.column] = newNode;
  return { nodes, newNode };
};
const findNodeBetween = (nodeOne: Node, nodeTwo: Node, nodes: Node[][]) => {
  let foundRow: number = 0;
  let foundColumn: number = 0;
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

  const foundNode: Node = nodes[foundRow][foundColumn];
  return foundNode;
};

const randomOne = (arr: any[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const setNeighbours = (nodes: Node[][]) => {
  const nrRows: number = nodes.length;
  const nrColumns: number = nodes[0].length;
  for (let r = 0; r < nrRows; r++) {
    for (let c = 0; c < nrColumns; c++) {
      if (isMazeNode(r, c)) {
        const neighbours = addNeighbours(nodes, r, c, nrRows, nrColumns);
        const currNode = nodes[r][c];
        const newNode = { ...currNode, neighbours: neighbours };
        nodes[r][c] = newNode;
      }
    }
  }
  return nodes;
};

const addNeighbours = (nodes: Node[][], row: number, col: number, maxRow: number, maxCol: number) => {
  const neighbours: Node[] | undefined = [];
  if (row - 2 > 0) neighbours.push(nodes[row - 2][col]);
  if (row + 2 < maxRow - 1) neighbours.push(nodes[row + 2][col]);
  if (col - 2 > 0) neighbours.push(nodes[row][col - 2]);
  if (col + 2 < maxCol - 1) neighbours.push(nodes[row][col + 2]);

  return neighbours;
};

const markAsFound = (node: Node) => {
  return { node: node, type: "clear" };
};

// const markAsVisited = (node: Node) => {
//   return { node: node, type: "visited" };
// };

const pickRandomFirstNode = (nodes: Node[][]) => {
  const mazeNodes: Node[] = [];

  for (let row = 0; row < nodes.length; row++) {
    for (let column = 0; column < nodes[0].length; column++) {
      if (isMazeNode(row, column)) mazeNodes.push(nodes[row][column]);
    }
  }

  return randomOne(mazeNodes);
};

const isMazeNode = (row: number, col: number) => {
  return row % 2 === 1 && col % 2 === 1;
};
