interface Node {
  id: number;
  row: number;
  column: number;
  type: string;
  prevType: string;
  neighbours: object[];
  distance: number;
}

export function randomMaze(nodes: Node[][]) {
  const generatedClearNodes = JSON.parse(JSON.stringify(nodes))
    .flat()
    .filter((node: Node) => {
      if (node.row === 0 || node.row === nodes.length - 1) return false;
      if (node.column === 0 || node.column === nodes[0].length - 1) return false;
      return Math.random() < 0.75;
    })
    .map((node: Node) => {
      return { node: node, type: "clear" };
    });

  return generatedClearNodes;
}
