import { createContext, useContext, useState } from "react";

export const AlgorithmsCont = createContext();

export const AlgorithmsContext = (props) => {
  const [currentAlgorithm, setCurrentAlgorithm] = useState("");
  const [currentMazeAlgorithm, setCurrentMazeAlgorithm] = useState("");
  const [currentAnimationStyle, setCurrentAnimationStyle] = useState("Classic");
  const [mazeAnimationSpeed, setMazeAnimationSpeed] = useState(5);
  const [algoAnimationSpeed, setAlgoAnimationSpeed] = useState(2);
  const [algoStats, setAlgoStats] = useState({ distance: 0, numberOfVisited: 0, timeTaken: 0 });
  return (
    <AlgorithmsCont.Provider
      value={{
        currentAlgorithm,
        setCurrentAlgorithm,
        currentMazeAlgorithm,
        setCurrentMazeAlgorithm,
        currentAnimationStyle,
        setCurrentAnimationStyle,
        mazeAnimationSpeed,
        setMazeAnimationSpeed,
        algoAnimationSpeed,
        setAlgoAnimationSpeed,
        setAlgoStats,
        algoStats,
      }}
    >
      {props.children}
    </AlgorithmsCont.Provider>
  );
};
export function useAlgorithm() {
  return useContext(AlgorithmsCont);
}
