export function dijkstra(nodes) {
  const algoNodes = JSON.parse(JSON.stringify(nodes));
  const startingNode = find("start", algoNodes);
  const endingNode = find("end", algoNodes);
  const priorityQueue = [];
}

const find = (nodeType, allNodes) => {
  for (let row = 0; row < algoNodes.length; row++) {
    for (let column = 0; column < algoNodes[0].length; column++) {
      if (algoNodes[row][column].type === nodeType) {
        return algoNodes[row][column];
      }
    }
  }
  `Couldn't find the ${nodeType.toUpper()} node`;
};
