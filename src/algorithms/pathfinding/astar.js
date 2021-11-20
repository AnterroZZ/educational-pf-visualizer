import { find, findNeighbours, findNodesOrderToStart } from "./pathfindingUtils";

export function astar(nodes) {
  const algoNodes = JSON.parse(JSON.stringify(nodes));
  let startingNode = find("start", algoNodes);
  const endingNode = find("end", algoNodes);
  const priorityQueue = [];
  const nodesOrder = [];
  let pathOrder = [];
  let endNodeDistance = 0;
  const startTime = performance.now();

  //TODO: No starting or ending node

  algoNodes[startingNode.row][startingNode.column] = {
    ...startingNode,
    distance: 0,
    g: 0,
    h: 0,
  };

  startingNode = algoNodes[startingNode.row][startingNode.column];
  priorityQueue.push(startingNode);

  while (priorityQueue.length > 0) {
    if (priorityQueue.length > 1)
      priorityQueue.sort((a, b) => {
        return b.distance - a.distance;
      });
    const currentNode = priorityQueue.pop();

    if (currentNode.type === "end") {
      pathOrder = findNodesOrderToStart(currentNode.previous);
      endNodeDistance = pathOrder.length;
      break;
    }

    const neighbours = findNeighbours(currentNode, algoNodes);
    if (currentNode.row === 9 && currentNode.column === 11) {
      console.log("x");
    }
    if (neighbours.length !== 0) {
      for (let i = 0; i < neighbours.length; i++) {
        const g = currentNode.g + 1;
        const h = Math.abs(neighbours[i].row - endingNode.row) + Math.abs(neighbours[i].column - endingNode.column);
        const distance = g + h;
        if (distance < algoNodes[neighbours[i].row][neighbours[i].column].distance) {
          const updatedNeighbour = {
            ...neighbours[i],
            g: g,
            h: h,
            distance: distance,
            previous: currentNode,
          };
          const objIndex = priorityQueue.findIndex((obj) => obj.id === updatedNeighbour.id);
          priorityQueue[objIndex] = updatedNeighbour;
          algoNodes[neighbours[i].row][neighbours[i].column] = updatedNeighbour;
        } else if (algoNodes[neighbours[i].row][neighbours[i].column].distance === null) {
          const updatedNeighbour = {
            ...neighbours[i],
            g: g,
            h: h,
            distance: distance,
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
