interface Node {
  id: number;
  row: number;
  column: number;
  type: string;
  prevType: string;
  neighbours: Node[];
  distance: number;
}

interface WrapperNode {
  node: Node;
  type: string;
}

export const recursive = (nodes: Node[]) => {
  if (!isValid(nodes)) {
    return [];
  }
  const generatedWallNodes: WrapperNode[] = [];
  const splittedNodes1: Node[] = [];
  const splittedNodes2: Node[] = [];

  const isHorizontal: boolean =
    nodes[nodes.length - 1].row - nodes[0].row > nodes[nodes.length - 1].column - nodes[0].column ? true : false;

  const divisionRow: number = findEvenFromRange(nodes[0].row, nodes[nodes.length - 1].row);
  const divisionColumn: number = findEvenFromRange(nodes[0].column, nodes[nodes.length - 1].column);
  let divide: number = isHorizontal ? divisionRow : divisionColumn;

  if (nodes[nodes.length - 1].row - nodes[0].row === 0) {
    divide = divisionColumn;
  } else if (nodes[nodes.length - 1].column - nodes[0].column === 0) {
    divide = divisionRow;
  }

  const wallNodes: WrapperNode[] = [];
  const passage: number = findPassage(isHorizontal, nodes);

  nodes.forEach((node: Node) => {
    if (node.row === 0 || node.row === 20 || node.column === 0 || node.column === 50) {
      return;
    }

    if (isHorizontal) {
      if (node.row === divide) {
        wallNodes.push(markAsWall(node));
      } else if (node.row < divide) {
        splittedNodes1.push(node);
      } else {
        splittedNodes2.push(node);
      }
    } else {
      if (node.column === divide) {
        wallNodes.push(markAsWall(node));
      } else if (node.column < divide) {
        splittedNodes1.push(node);
      } else {
        splittedNodes2.push(node);
      }
    }
  });

  const wallNodesWithPassage = wallNodes.filter((item) => {
    return isHorizontal ? item.node.column !== passage : item.node.row !== passage;
  });

  generatedWallNodes.push(...wallNodesWithPassage);
  generatedWallNodes.push(...recursive(splittedNodes1));
  generatedWallNodes.push(...recursive(splittedNodes2));

  return generatedWallNodes;
};

function findPassage(horizontal: boolean, nodes: Node[]) {
  if (horizontal) {
    return findOddFromRange(nodes[0].column, nodes[nodes.length - 1].column);
  } else return findOddFromRange(nodes[0].row, nodes[nodes.length - 1].row);
}
function isValid(nodes: Node[]) {
  if (nodes.length < 3) {
    return false;
  }
  if (nodes[nodes.length - 1].row - nodes[0].row === 0 || nodes[nodes.length - 1].column - nodes[0].column === 0) {
    return false;
  } else {
    return true;
  }
}
const markAsWall = (node: Node) => {
  return { node: node, type: "wall" };
};

function findEvenFromRange(start: number, end: number) {
  const rangeArray: number[] = Array(end - start + 1)
    .fill(0)
    .map((_, idx) => start + idx);
  const filteredArray = rangeArray.filter((number) => number % 2 === 0);
  return filteredArray[Math.floor(Math.random() * filteredArray.length)];
}

function findOddFromRange(start: number, end: number) {
  const rangeArray: number[] = Array(end - start + 1)
    .fill(0)
    .map((_, idx) => start + idx);
  const filteredArray = rangeArray.filter((number) => number % 2 !== 0);
  return filteredArray[Math.floor(Math.random() * filteredArray.length)];
}
