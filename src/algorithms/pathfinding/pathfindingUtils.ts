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

export const find = (nodeType: string, allNodes: Node[][]) => {
  for (let row = 0; row < allNodes.length; row++) {
    for (let column = 0; column < allNodes[0].length; column++) {
      if (allNodes[row][column].type === nodeType) {
        return allNodes[row][column];
      }
    }
  }
  // console.log(`Couldn't find the ${nodeType.toUpper()} node`);
};

export const findNeighbours = (node: Node, allNodes: Node[][]) => {
  const neighbours: Node[] = [];
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

export const findNodesOrderToStart = (finalNode: Node) => {
  const nodesOrder: Node[] = [];
  let currentNode: Node = finalNode;
  while (currentNode.type !== "start") {
    if (currentNode.previous === undefined) {
      break;
    }
    nodesOrder.push(currentNode);
    currentNode = currentNode.previous;
  }
  if (nodesOrder.length === 0) {
    return undefined;
  } else return nodesOrder.reverse();
};
