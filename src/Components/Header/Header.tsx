import Picker from "./HeaderComponents/Picker/Picker";
import styles from "./Header.module.css";
import DropdownMenu from "./HeaderComponents/DropdownMenu/DropdownMenu";
import DropdownItem from "./HeaderComponents/DropdownItem/DropdownItem";
import { useAlgorithm } from "../Contex/AlgorithmsContext";
import Button from "../UI/Button/Button";
import { useState } from "react";
import { useControls } from "../Contex/ControlsContext";
import plFlag from "../../assets/flags/pl.svg";
import enFlag from "../../assets/flags/gb.svg";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const Header = () => {
  const { t } = useTranslation();
  const {
    setCurrentAlgorithm,
    setCurrentMazeAlgorithm,
    currentAnimationStyle,
    setCurrentAnimationStyle,
    setMazeAnimationSpeed,
    currentAlgorithm,
    setAlgoAnimationSpeed,
  } = useAlgorithm();
  const { setMainPageCommand } = useControls();
  const [mazeAnimationSpeedText, setMazeAnimationSpeedText] = useState("Normal");
  const [algoAnimationSpeedText, setAlgoAnimationSpeedText] = useState("Fast");

  const pathfindingAlgosList = [
    "A* search",
    "Dijkstra's algorithm",
    "Depth first search",
    "Breadth first search",
    "Best first search",
  ];
  const handleAlgoritmsChosen = (name: string) => {
    setCurrentAlgorithm(name);
    console.log(`Current algorithm set to: ${name}`);
  };

  const handleMazeChosen = (name: string) => {
    setCurrentMazeAlgorithm(name);
  };

  const handleOnAnimationChange = (event: any) => {
    currentAnimationStyle === "Classic" ? setCurrentAnimationStyle("Educational") : setCurrentAnimationStyle("Classic");
    event.stopPropagation();
  };

  const handleChangeOfMazeAnimationSpeed = (event: any) => {
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

  const handleChangeOfAlgoAnimationSpeed = (event: any) => {
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
    i18next.language === "en" ? i18next.changeLanguage("pl") : i18next.changeLanguage("en");
  };

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.wraper}>
        <h2>{t("title")}</h2>
        <h2 className={styles.divider}>/</h2>
        <Picker name={t("header_algorithms_menu")}>
          <DropdownMenu>
            <p className={styles.subtitle}>{t("header_animation_speed")}</p>
            <Button text={algoAnimationSpeedText} onClick={handleChangeOfAlgoAnimationSpeed} />
            <hr />
            {pathfindingAlgosList.map((item) => {
              return <DropdownItem key={item} onClick={handleAlgoritmsChosen} name={item} />;
            })}
          </DropdownMenu>
        </Picker>
        <h3>/</h3>
        <Picker name={t("header_generate_maze")}>
          <DropdownMenu>
            <p className={styles.subtitle}>{t("header_animation_style")}</p>
            <Button text={currentAnimationStyle} onClick={handleOnAnimationChange} />
            <p className={styles.subtitle}>{t("header_animation_speed")}</p>
            <Button text={mazeAnimationSpeedText} onClick={handleChangeOfMazeAnimationSpeed} />
            <hr />
            <DropdownItem onClick={handleMazeChosen} name={"Random maze"} />

            <DropdownItem onClick={handleMazeChosen} name={"Recursive backtracking"} />
            <DropdownItem onClick={handleMazeChosen} name={"Recursive division"} />
          </DropdownMenu>
        </Picker>
        <h2 className={styles.divider}>/</h2>
        <p className={styles.clearButton} onClick={() => setMainPageCommand("clear")}>
          {t("header_clear_walls")}
        </p>
        <h3>/</h3>
        <p className={styles.clearButton} onClick={() => setMainPageCommand("reset")}>
          {t("header_reset_board")}
        </p>
        <h2 className={styles.divider}>/</h2>
        <p className={styles.currentAlgo}>
          {t("header_current_algo")}: {currentAlgorithm}
        </p>
      </div>
      <img
        alt="language"
        onClick={handleLanguageChange}
        src={i18next.language === "en" ? enFlag : plFlag}
        className={styles.english}
      ></img>
    </div>
  );
};

export default Header;
