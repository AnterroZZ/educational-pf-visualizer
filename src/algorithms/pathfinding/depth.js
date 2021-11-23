import { find, findNeighbours, findNodesOrderToStart } from "./pathfindingUtils";

export function depth(nodes) {
  const algoNodes = JSON.parse(JSON.stringify(nodes));
  const startingNode = find("start", algoNodes);
  const endingNode = find("end", algoNodes);
  const priorityQueue = [];
  const nodesOrder = [];
  let pathOrder = [];
  let endNodeDistance = 0;
  const startTime = performance.now();

  priorityQueue.push(startingNode);

  while (priorityQueue.length > 0) {
    const currentNode = priorityQueue.pop();
    if (currentNode.type === "end") {
      pathOrder = findNodesOrderToStart(currentNode.previous);
      endNodeDistance = pathOrder.length;
      break;
    }

    const neighbours = findNeighbours(currentNode, algoNodes);
    if (neighbours.length !== 0) {
      for (let i = 0; i < neighbours.length; i++) {
        const objIndex = priorityQueue.findIndex((obj) => obj.id === neighbours[i].id);
        if (objIndex === -1) {
          const updatedNeighbour = {
            ...neighbours[i],
            previous: currentNode,
          };
          priorityQueue.push(updatedNeighbour);
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
