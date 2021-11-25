import { find, findNeighbours, findNodesOrderToStart } from "./pathfindingUtils";

export function breadth(nodes) {
  const algoNodes = JSON.parse(JSON.stringify(nodes));
  const startingNode = find("start", algoNodes);
  const endingNode = find("end", algoNodes);
  const priorityQueue = [];
  const nodesOrder = [];
  let pathOrder = [];
  let endNodeDistance = 0;

  if (!startingNode || !endingNode) {
    return {
      nodesOrder: 0,
      pathOrder: 0,
      statistics: {
        distance: 0,
        numberOfVisited: 0,
        timeTaken: 0,
      },
    };
  }

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
      endNodeDistance = pathOrder.length;
      break;
    }

    const neighbours = findNeighbours(currentNode, algoNodes);
    if (neighbours.length !== 0) {
      for (let i = 0; i < neighbours.length; i++) {
        if (algoNodes[neighbours[i].row][neighbours[i].column].distance === null) {
          const updatedNeighbour = {
            ...neighbours[i],
            distance: currentNode.distance + 1,
            previous: currentNode,
          };

          priorityQueue.push(updatedNeighbour);
          algoNodes[neighbours[i].row][neighbours[i].column] = updatedNeighbour;
        }
      }
    }
    if (currentNode.type !== "start") {
      nodesOrder.push(currentNode);
      algoNodes[currentNode.row][currentNode.column] = {
        ...currentNode,
        type: "visited",
      };
    }
  }
  const endTime = performance.now();
  const timeTaken = endTime - startTime;
  return {
    nodesOrder,
    pathOrder,
    statistics: {
      distance: endNodeDistance,
      numberOfVisited: nodesOrder.length,
      timeTaken: timeTaken,
    },
  };
}
