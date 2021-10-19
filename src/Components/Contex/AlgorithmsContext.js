import { createContext, useContext, useState } from "react";

export const AlgorithmsCont = createContext();

export const AlgorithmsContext = (props) => {
  const [currentAlgorithm, setCurrentAlgorithm] = useState("");
  const [currentMazeAlgorithm, setCurrentMazeAlgorithm] = useState("");
  return (
    <AlgorithmsCont.Provider
      value={{
        currentAlgorithm,
        setCurrentAlgorithm,
        currentMazeAlgorithm,
        setCurrentMazeAlgorithm,
      }}
    >
      {props.children}
    </AlgorithmsCont.Provider>
  );
};
export function useAlgorithm() {
  return useContext(AlgorithmsCont);
}
