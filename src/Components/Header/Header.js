import Picker from "./HeaderComponents/Picker/Picker";
import styles from "./Header.module.css";
import DropdownMenu from "./HeaderComponents/DropdownMenu/DropdownMenu";
import DropdownItem from "./HeaderComponents/DropdownItem/DropdownItem";
import { useAlgorithm } from "../Contex/AlgorithmsContext";
import Button from "../UI/Button/Button";
import { useState } from "react";
import { useControls } from "../Contex/ControlsContext";
import plFlag from "../../flags/pl.svg";
import enFlag from "../../flags/gb.svg";

const Header = () => {
  const {
    setCurrentAlgorithm,
    setCurrentMazeAlgorithm,
    currentAnimationStyle,
    setCurrentAnimationStyle,
    setMazeAnimationSpeed,
    currentAlgorithm,
    setAlgoAnimationSpeed,
  } = useAlgorithm();
  const { setClear, language, setLanguage } = useControls();
  const [mazeAnimationSpeedText, setMazeAnimationSpeedText] = useState("Normal");
  const [algoAnimationSpeedText, setAlgoAnimationSpeedText] = useState("Fast");

  const pathfindingAlgosList = [
    "A* search",
    "Dijkstra's algorithm",
    "Depth first search",
    "Breadth first search",
    "Best first search",
  ];
  const handleAlgoritmsChosen = (name) => {
    setCurrentAlgorithm(name);
    console.log(`Current algorithm set to: ${name}`);
  };

  const handleMazeChosen = (name) => {
    setCurrentMazeAlgorithm(name);
    console.log(name);
  };

  const handleOnAnimationChange = (event) => {
    currentAnimationStyle === "Classic" ? setCurrentAnimationStyle("Educational") : setCurrentAnimationStyle("Classic");
    event.stopPropagation();
  };

  const handleChangeOfMazeAnimationSpeed = (event) => {
    if (mazeAnimationSpeedText === "Normal") {
      setMazeAnimationSpeed(4);
      setMazeAnimationSpeedText("Fast");
    } else if (mazeAnimationSpeedText === "Fast") {
      setMazeAnimationSpeed(20);
      setMazeAnimationSpeedText("Slow");
    } else if (mazeAnimationSpeedText === "Slow") {
      setMazeAnimationSpeed(10);
      setMazeAnimationSpeedText("Normal");
    }
    event.stopPropagation();
  };

  const handleChangeOfAlgoAnimationSpeed = (event) => {
    if (algoAnimationSpeedText === "Normal") {
      setAlgoAnimationSpeed(2);
      setAlgoAnimationSpeedText("Fast");
    } else if (algoAnimationSpeedText === "Fast") {
      setAlgoAnimationSpeed(20);
      setAlgoAnimationSpeedText("Slow");
    } else if (algoAnimationSpeedText === "Slow") {
      setAlgoAnimationSpeed(8);
      setAlgoAnimationSpeedText("Normal");
    }
    event.stopPropagation();
  };

  const handleLanguageChange = () => {
    language === "english" ? setLanguage("polish") : setLanguage("english");
  };

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.wraper}>
        <h2>Pathfinding algorithms</h2>
        <h2 className={styles.divider}>/</h2>
        <Picker name="Algorithms">
          <DropdownMenu>
            <p className={styles.subtitle}>Animation speed</p>
            <Button text={algoAnimationSpeedText} onClick={handleChangeOfAlgoAnimationSpeed} />
            <hr />
            {pathfindingAlgosList.map((item) => {
              return <DropdownItem key={item} onClick={handleAlgoritmsChosen} name={item} />;
            })}
          </DropdownMenu>
        </Picker>
        <h3>/</h3>
        <Picker name="Generate maze">
          <DropdownMenu>
            <p className={styles.subtitle}>Animation style</p>
            <Button text={currentAnimationStyle} onClick={handleOnAnimationChange} />
            <p className={styles.subtitle}>Animation speed</p>
            <Button text={mazeAnimationSpeedText} onClick={handleChangeOfMazeAnimationSpeed} />
            <hr />
            <DropdownItem onClick={handleMazeChosen} name={"Random maze"} />

            <DropdownItem onClick={handleMazeChosen} name={"Recursive backtracking"} />
          </DropdownMenu>
        </Picker>
        <h2 className={styles.divider}>/</h2>
        {/* <Controls /> */}
        <p className={styles.clearButton} onClick={() => setClear("clear")}>
          Clear walls
        </p>
        <h3>/</h3>
        <p className={styles.clearButton} onClick={() => setClear("reset")}>
          Reset board
        </p>
        <h2 className={styles.divider}>/</h2>
        <p className={styles.currentAlgo}>Current algorithm: {currentAlgorithm}</p>
      </div>
      <img
        onClick={handleLanguageChange}
        src={language === "english" ? enFlag : plFlag}
        className={styles.english}
      ></img>
    </div>
  );
};

export default Header;
