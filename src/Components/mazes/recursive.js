export async function recursive(nodes, setNodes, updateGrid) {
  //Walls around grid
  for (let row = 0; row < 20; row++) {
    for (let column = 0; column < 50; column++) {
      if (row === 0 || row === 19 || column === 0 || column === 49) {
        setNodes(updateGrid(nodes, column, row, "wall", "clear"));
        await sleep(5);
      }
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
