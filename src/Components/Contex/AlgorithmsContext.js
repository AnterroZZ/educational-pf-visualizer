import { createContext, useContext, useState } from "react";

export const AlgorithmsCont = createContext();

export const AlgorithmsContext = (props) => {
  const [currentAlgorithm, setCurrentAlgorithm] = useState("");
  const [currentMazeAlgorithm, setCurrentMazeAlgorithm] = useState("");
  const [currentAnimationStyle, setCurrentAnimationStyle] = useState("Classic");
  const [animationSpeed, setAnimationSpeed] = useState(5);
  return (
    <AlgorithmsCont.Provider
      value={{
        currentAlgorithm,
        setCurrentAlgorithm,
        currentMazeAlgorithm,
        setCurrentMazeAlgorithm,
        currentAnimationStyle,
        setCurrentAnimationStyle,
        animationSpeed,
        setAnimationSpeed,
      }}
    >
      {props.children}
    </AlgorithmsCont.Provider>
  );
};
export function useAlgorithm() {
  return useContext(AlgorithmsCont);
}
