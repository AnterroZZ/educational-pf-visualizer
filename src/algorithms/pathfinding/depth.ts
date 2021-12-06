import { Node, find, findNeighbours, findNodesOrderToStart } from "./pathfindingUtils";

export function depth(nodes: Node[][]) {
  const algoNodes: Node[][] = JSON.parse(JSON.stringify(nodes));
  const startingNode: Node | undefined = find("start", algoNodes);
  const endingNode: Node | undefined = find("end", algoNodes);

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

  const priorityQueue: Node[] = [];
  const nodesOrder: Node[] = [];
  let pathOrder: Node[] | undefined = [];
  let endNodeDistance: number = 0;
  const startTime: number = performance.now();

  priorityQueue.push(startingNode);

  while (priorityQueue.length > 0) {
    const currentNode: Node | undefined = priorityQueue.pop();
    if (currentNode === undefined) {
      break;
    }

    if (currentNode.type === "end" && currentNode.previous) {
      pathOrder = findNodesOrderToStart(currentNode.previous);
      if (pathOrder) {
        endNodeDistance = pathOrder.length;
      }
      break;
    }

    const neighbours: Node[] = findNeighbours(currentNode, algoNodes);
    if (neighbours.length !== 0) {
      for (let i = 0; i < neighbours.length; i++) {
        const objIndex: number = priorityQueue.findIndex((obj) => obj.id === neighbours[i].id);
        if (objIndex === -1) {
          const updatedNeighbour: Node = {
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
