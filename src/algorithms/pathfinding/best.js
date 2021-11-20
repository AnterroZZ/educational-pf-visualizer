export function best(nodes) {
  const algoNodes = JSON.parse(JSON.stringify(nodes));
  let startingNode = find("start", algoNodes);
  const endingNode = find("end", algoNodes);
  const openList = [];
  const nodesOrder = [];
  let pathOrder = [];
  let distance = 0;
  const startTime = performance.now();
  algoNodes[startingNode.row][startingNode.column] = {
    ...startingNode,
    distance: 0,
    g: 0,
    h: 0,
  };
  startingNode = algoNodes[startingNode.row][startingNode.column];
  openList.push(startingNode);
  let isNotFound = true;

  while (openList.length > 0 && isNotFound) {
    if (openList.length > 1)
      openList.sort((a, b) => {
        return b.distance - a.distance;
      });
    const q = openList.pop();

    if (q.row === endingNode.row && q.column === endingNode.column) {
      pathOrder = findNodesOrderToStart(q.previous);
      distance = q.distance;
      break;
    }

    if (q.type !== "start") nodesOrder.push(q);

    const neighbours = findNeighbours(q, algoNodes);
    if (neighbours.length !== 0) {
      for (let i = 0; i < neighbours.length; i++) {
        if (neighbours[i].type === "clear") {
          const g = q.g + 1;
          const h =
            Math.abs(neighbours[i].row - endingNode.row) +
            Math.abs(neighbours[i].column - endingNode.column);
          const distance = h;
          const updatedNeighbour = {
            ...neighbours[i],
            g: g,
            h: h,
            distance: distance,
            previous: q,
            type: "visited",
          };
          // nodesOrder.push(updatedNeighbour);
          openList.push(updatedNeighbour);
          algoNodes[neighbours[i].row][neighbours[i].column] = updatedNeighbour;
        } else if (neighbours[i].type === "end") {
          const g = q.g + 1;
          const h =
            Math.abs(neighbours[i].row - endingNode.row) +
            Math.abs(neighbours[i].column - endingNode.column);
          const distance = h;
          const updatedNeighbour = {
            ...neighbours[i],
            g: g,
            h: h,
            distance: distance,
            previous: q,
            type: "end",
          };
          openList.push(updatedNeighbour);
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
      distance: distance,
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
