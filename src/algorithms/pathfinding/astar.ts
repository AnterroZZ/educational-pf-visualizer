import { find, findNeighbours, findNodesOrderToStart } from "./pathfindingUtils";

export interface Node {
  id: number;
  row: number;
  column: number;
  type: string;
  prevType: string;
  neighbours: Node[];
  distance: number;
  g?: number;
  h?: number;
  previous?: Node;
}

export function astar(nodes: Node[][]) {
  const algoNodes: Node[][] = JSON.parse(JSON.stringify(nodes));
  const startNode: Node | undefined = find("start", algoNodes);
  const endingNode: Node | undefined = find("end", algoNodes);
  const priorityQueue: Node[] = [];
  const nodesOrder: Node[] = [];
  let pathOrder: Node[] | undefined = [];
  let endNodeDistance = 0;
  const startTime: number = performance.now();

  //No start or end node
  if (startNode === undefined || endingNode === undefined) {
    return {
      nodesOrder: 0,
      pathOrder: undefined,
      statistics: {
        distance: 0,
        numberOfVisited: 0,
        timeTaken: 0,
      },
    };
  }

  algoNodes[startNode.row][startNode.column] = {
    ...startNode,
    distance: 0,
    g: 0,
    h: 0,
  };

  const startingNode: Node = algoNodes[startNode.row][startNode.column];
  priorityQueue.push(startingNode);

  while (priorityQueue.length > 0) {
    if (priorityQueue.length > 1)
      priorityQueue.sort((a, b) => {
        return b.distance - a.distance;
      });
    const currentNode: Node | undefined = priorityQueue.pop();
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

    if (neighbours.length !== 0 && currentNode.g !== undefined) {
      for (let i = 0; i < neighbours.length; i++) {
        const g: number = currentNode.g + 1;
        const h: number =
          Math.abs(neighbours[i].row - endingNode.row) + Math.abs(neighbours[i].column - endingNode.column);
        const distance: number = g + h;
        if (distance < algoNodes[neighbours[i].row][neighbours[i].column].distance) {
          const updatedNeighbour: Node = {
            ...neighbours[i],
            g: g,
            h: h,
            distance: distance,
            previous: currentNode,
          };
          const objIndex: number = priorityQueue.findIndex((obj) => obj.id === updatedNeighbour.id);
          priorityQueue[objIndex] = updatedNeighbour;
          algoNodes[neighbours[i].row][neighbours[i].column] = updatedNeighbour;
        } else if (algoNodes[neighbours[i].row][neighbours[i].column].distance === null) {
          const updatedNeighbour: Node = {
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
