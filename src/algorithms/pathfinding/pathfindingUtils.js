export const find = (nodeType, allNodes) => {
  for (let row = 0; row < allNodes.length; row++) {
    for (let column = 0; column < allNodes[0].length; column++) {
      if (allNodes[row][column].type === nodeType) {
        return allNodes[row][column];
      }
    }
  }
  // console.log(`Couldn't find the ${nodeType.toUpper()} node`);
};

export const findNeighbours = (node, allNodes) => {
  const neighbours = [];
  if (node.row + 1 < allNodes.length) {
    neighbours.push(allNodes[node.row + 1][node.column]);
  }
  if (node.column + 1 < allNodes[0].length) {
    neighbours.push(allNodes[node.row][node.column + 1]);
  }
  if (node.row - 1 >= 0) {
    neighbours.push(allNodes[node.row - 1][node.column]);
  }
  if (node.column - 1 >= 0) {
    neighbours.push(allNodes[node.row][node.column - 1]);
  }

  return neighbours.filter(
    (neighbour) => neighbour.type !== "wall" && neighbour.type !== "visited" && neighbour.type !== "start"
  );
};

export const findNodesOrderToStart = (finalNode) => {
  const nodesOrder = [];
  let currentNode = finalNode;
  while (currentNode.type !== "start") {
    nodesOrder.push(currentNode);
    currentNode = currentNode.previous;
  }

  return nodesOrder.reverse();
};
