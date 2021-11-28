function Neighbour(row, column) {
  return {
    row: row,
    column: column,
  };
}

export const recursive = (nodes) => {
  const copyOfNodes = JSON.parse(JSON.stringify(nodes));
  const nodesOrder = [];
  const horizontal =
    nodes[nodes.length - 1].row - nodes[0].row > nodes[nodes.length - 1].column - nodes[0].column ? true : false;
  console.log(nodes[nodes.length - 1]);
  const divideRow = findEvenFromRange(nodes[0].row, nodes[nodes.length - 1].row);
  const divideColumn = findEvenFromRange(nodes[0].column, nodes[nodes.length - 1].column);
  let divide = horizontal ? divideRow : divideColumn;
  if (nodes[nodes.length - 1].row - nodes[0].row === 0) {
    divide = divideColumn;
  } else if (nodes[nodes.length - 1].column - nodes[0].column === 0) {
    divide = divideRow;
  }

  const nodes1 = [];
  const nodes2 = [];
  const wallNodes = [];
  const passage = findPassage(horizontal, copyOfNodes);
  copyOfNodes.forEach((node) => {
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

function findPassage(horizontal, nodes) {
  if (horizontal) {
    return findOddFromRange(nodes[0].column, nodes[nodes.length - 1].column);
  } else return findOddFromRange(nodes[0].row, nodes[nodes.length - 1].row);
}
function check(nodes) {
  if (nodes.length < 3) {
    return false;
  }
  if (nodes[nodes.length - 1].row - nodes[0].row === 0 || nodes[nodes.length - 1].column - nodes[0].column === 0) {
    return false;
  } else {
    return true;
  }
}
const markAsWall = (node, nodes) => {
  return { node: node, type: "wall" };
};

function findEvenFromRange(start, end) {
  const rangeArray = Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);
  const filteredArray = rangeArray.filter((number) => number % 2 === 0);
  return filteredArray[Math.floor(Math.random() * filteredArray.length)];
}

function findOddFromRange(start, end) {
  const rangeArray = Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);
  const filteredArray = rangeArray.filter((number) => number % 2 !== 0);
  return filteredArray[Math.floor(Math.random() * filteredArray.length)];
}
