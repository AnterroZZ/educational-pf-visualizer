import { Node, find, findNeighbours, findNodesOrderToStart } from "./pathfindingUtils";

export function breadth(nodes: Node[][]) {
  const algoNodes: Node[][] = JSON.parse(JSON.stringify(nodes));
  const startingNode: Node | undefined = find("start", algoNodes);
  const endingNode: Node | undefined = find("end", algoNodes);
  const priorityQueue: Node[] = [];
  const nodesOrder: Node[] = [];
  let pathOrder: Node[] | undefined = [];
  let endNodeDistance: number = 0;

  if (startingNode === undefined || endingNode === undefined) {
    return {
      nodesOrder: undefined,
      pathOrder: undefined,
      statistics: {
        distance: 0,
        numberOfVisited: 0,
        timeTaken: 0,
      },
    };
  }

  const startTime: number = performance.now();

  algoNodes[startingNode.row][startingNode.column] = {
    ...startingNode,
    distance: 0,
  };

  priorityQueue.push(startingNode);

  while (priorityQueue.length > 0) {
    const currentNode: Node | undefined = priorityQueue.shift();

    if (currentNode === undefined) {
      break;
    }

    if (currentNode.type === "end" && currentNode.previous) {
      pathOrder = findNodesOrderToStart(currentNode.previous);
      if (pathOrder !== undefined) {
        endNodeDistance = pathOrder.length;
      }
      break;
    }

    const neighbours: Node[] = findNeighbours(currentNode, algoNodes);
    if (neighbours.length !== 0) {
      for (let i = 0; i < neighbours.length; i++) {
        if (algoNodes[neighbours[i].row][neighbours[i].column].distance === null) {
          const updatedNeighbour: Node = {
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
  const endTime: number = performance.now();
  const timeTaken: number = endTime - startTime;
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
