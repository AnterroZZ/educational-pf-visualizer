import { populateNodes } from "../MainPage/MainPage";

export async function recursive(nodes, setNodes, updateGrid) {
  //Walls around grid
  for (let row = 0; row < 21; row++) {
    for (let column = 0; column < 51; column++) {
      if (
        !(
          nodes[row][column].type === "start" ||
          nodes[row][column].type === "end"
        )
      ) {
        if (row === 0 || row === 20 || column === 0 || column === 50) {
          setNodes(updateGrid(nodes, column, row, "wall", "clear"));
        }
        if (row % 2 === 0 || (row % 2 === 1 && column % 2 === 0)) {
          setNodes(updateGrid(nodes, column, row, "wall", "clear"));
        }
      }
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
