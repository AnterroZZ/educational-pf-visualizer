export function dijkstra(nodes) {
  const algoNodes = JSON.parse(JSON.stringify(nodes));
  const startingNode = find("start", algoNodes);
  const priorityQueue = [];
  const nodesOrder = [];
  let pathOrder = [];
  let isNotFound = true;

  algoNodes[startingNode.row][startingNode.column] = {
    ...startingNode,
    distance: 0,
  };
  priorityQueue.push(startingNode);

  while (priorityQueue.length > 0 && isNotFound) {
    const currentNode = priorityQueue.shift();
    const neighbours = findNeighbours(currentNode, algoNodes);
    if (neighbours.length !== 0) {
      for (let i = 0; i < neighbours.length; i++) {
        switch (neighbours[i].type) {
          case "clear":
            const updatedNeighbour = {
              ...neighbours[i],
              type: "visited",
              distance: currentNode.distance + 1,
              previous: currentNode,
            };
            nodesOrder.push(updatedNeighbour);

            algoNodes[neighbours[i].row][neighbours[i].column] =
              updatedNeighbour;
            priorityQueue.push(updatedNeighbour);
            break;
          case "end":
            isNotFound = false;
            pathOrder = findNodesOrderToStart(currentNode);
            break;
          default:
          // console.log(`No such node type: ${neighbours[i].type}`);
        }
      }
    }
  }
  return { nodesOrder, pathOrder };
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
