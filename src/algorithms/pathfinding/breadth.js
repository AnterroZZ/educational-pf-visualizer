export function breadth(nodes) {
  const algoNodes = JSON.parse(JSON.stringify(nodes));
  const startingNode = find("start", algoNodes);
  const priorityQueue = [];
  const nodesOrder = [];
  let pathOrder = [];
  let distance = 0;
  const startTime = performance.now();

  algoNodes[startingNode.row][startingNode.column] = {
    ...startingNode,
    distance: 0,
  };
  priorityQueue.push(startingNode);

  while (priorityQueue.length > 0) {
    const currentNode = priorityQueue.shift();

    if (currentNode.type === "end") {
      pathOrder = findNodesOrderToStart(currentNode.previous);
      distance = currentNode.distance;
      break;
    }

    if (currentNode.type !== "start") nodesOrder.push(currentNode);

    const neighbours = findNeighbours(currentNode, algoNodes);
    if (neighbours.length !== 0) {
      for (let i = 0; i < neighbours.length; i++) {
        if (neighbours[i].type === "clear") {
          const updatedNeighbour = {
            ...neighbours[i],
            type: "visited",
            distance: currentNode.distance + 1,
            previous: currentNode,
          };
          priorityQueue.push(updatedNeighbour);
          algoNodes[neighbours[i].row][neighbours[i].column] = updatedNeighbour;
        } else if (neighbours[i].type === "end") {
          const updatedNeighbour = {
            ...neighbours[i],
            type: "end",
            distance: currentNode.distance + 1,
            previous: currentNode,
          };
          priorityQueue.push(updatedNeighbour);
          algoNodes[neighbours[i].row][neighbours[i].column] = updatedNeighbour;
        }
      }
    }
  }
  const endTime = performance.now();
  const timeTaken = endTime - startTime;
  return {
    nodesOrder,
    pathOrder,
    statistics: {
      distance: distance + 1,
      numberOfVisited: nodesOrder.length,
      timeTaken: timeTaken,
    },
  };
}

const findNodesOrderToStart = (finalNode) => {
  const nodesOrder = [];
  let currentNode = finalNode;
  while (currentNode.type !== "start") {
    nodesOrder.push(currentNode);
    currentNode = currentNode.previous;
  }

  return nodesOrder.reverse();
};

const findNeighbours = (node, allNodes) => {
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

  return neighbours;
};

const find = (nodeType, allNodes) => {
  for (let row = 0; row < allNodes.length; row++) {
    for (let column = 0; column < allNodes[0].length; column++) {
      if (allNodes[row][column].type === nodeType) {
        return allNodes[row][column];
      }
    }
  }
  // console.log(`Couldn't find the ${nodeType.toUpper()} node`);
};
