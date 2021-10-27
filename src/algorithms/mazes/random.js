export function randomMaze(nodes) {
  const newNodes = JSON.parse(JSON.stringify(nodes))
    .flat()
    .filter((node) => {
      if (node.row === 0 || node.row === nodes.length - 1) return false;
      if (node.column === 0 || node.column === nodes[0].length - 1)
        return false;
      return Math.random() < 0.75;
    })
    .map((n) => {
      return { node: n, type: "clear" };
    });

  return newNodes;
}
