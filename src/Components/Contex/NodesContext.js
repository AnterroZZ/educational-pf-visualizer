import { createContext, useContext, useState } from "react";

export const NodesCont = createContext();

export const NodesContext = (props) => {
  const [nodes, setNodes] = useState([]);

  // Node types are: clear, wall, start, end, visited
  function SingleNode(id, row, column) {
    this.id = id;
    this.row = row;
    this.column = column;
    this.type = "clear";
    this.isStart = false;
    this.isEnd = false;
    this.isWall = false;
    this.isVisited = false;
  }

  const handleResetBoard = () => {
    let nodes = [];
    for (let row = 0; row < 20; row++) {
      let currentRow = [];
      for (let column = 0; column < 50; column++) {
        currentRow.push(new SingleNode(row * 50 + column, row, column));
      }
      nodes.push(currentRow);
    }
    return nodes;
  };

  return (
    <NodesCont.Provider
      value={{
        nodes,
        setNodes,
        handleResetBoard,
      }}
    >
      {props.children}
    </NodesCont.Provider>
  );
};

export function useNodes() {
  return useContext(NodesCont);
}
