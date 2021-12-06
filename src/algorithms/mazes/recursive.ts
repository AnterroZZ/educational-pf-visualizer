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
  const copyOfNodes = JSON.parse(JSON.stringify(nodes));
  const nodesOrder: WrapperNode[] = [];
  const horizontal: boolean =
    nodes[nodes.length - 1].row - nodes[0].row > nodes[nodes.length - 1].column - nodes[0].column ? true : false;
  const divideRow: number = findEvenFromRange(nodes[0].row, nodes[nodes.length - 1].row);
  const divideColumn: number = findEvenFromRange(nodes[0].column, nodes[nodes.length - 1].column);
  let divide: number = horizontal ? divideRow : divideColumn;
  if (nodes[nodes.length - 1].row - nodes[0].row === 0) {
    divide = divideColumn;
  } else if (nodes[nodes.length - 1].column - nodes[0].column === 0) {
    divide = divideRow;
  }

  const nodes1: Node[] = [];
  const nodes2: Node[] = [];
  const wallNodes: WrapperNode[] = [];
  const passage: number = findPassage(horizontal, copyOfNodes);
  copyOfNodes.forEach((node: Node) => {
    if (!(node.row === 0 || node.row === 20 || node.column === 0 || node.column === 50)) {
      if (horizontal) {
        if (node.row === divide) {
          wallNodes.push(markAsWall(node));
        } else if (node.row < divide) {
          nodes1.push(node);
        } else {
          nodes2.push(node);
        }
      } else {
        if (node.column === divide) {
          wallNodes.push(markAsWall(node));
        } else if (node.column < divide) {
          nodes1.push(node);
        } else {
          nodes2.push(node);
        }
      }
    }
  });

  if (horizontal) {
    nodesOrder.push(...wallNodes.filter((item) => item.node.column !== passage));
  } else nodesOrder.push(...wallNodes.filter((item) => item.node.row !== passage));

  if (check(nodes1)) {
    nodesOrder.push(...recursive(nodes1));
  }

  if (check(nodes2)) {
    nodesOrder.push(...recursive(nodes2));
  }
  return nodesOrder;
};

function findPassage(horizontal: boolean, nodes: Node[]) {
  if (horizontal) {
    return findOddFromRange(nodes[0].column, nodes[nodes.length - 1].column);
  } else return findOddFromRange(nodes[0].row, nodes[nodes.length - 1].row);
}
function check(nodes: Node[]) {
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
