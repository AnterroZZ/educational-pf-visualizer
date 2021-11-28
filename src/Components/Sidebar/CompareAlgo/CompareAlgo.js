import styles from "./CompareAlgo.module.css";
import Button from "../../UI/Button/Button";
import { useEffect, useState } from "react";
import { useControls } from "../../Contex/ControlsContext";
import { useAlgorithm } from "../../Contex/AlgorithmsContext";
import DropdownMenu from "../../Header/HeaderComponents/DropdownMenu/DropdownMenu";
import Picker from "../../Header/HeaderComponents/Picker/Picker";
import DropdownItem from "../../Header/HeaderComponents/DropdownItem/DropdownItem";
let currentAlgos = [];
const pathfindingAlgosList = [
  "A* search",
  "Dijkstra's algorithm",
  "Depth first search",
  "Breadth first search",
  "Best first search",
];

const CompareAlgo = ({ isCompareOpen }) => {
  const [algosToCompare, setAlgosToCompare] = useState([]);
  const { executeAlgo, setExecuteAlgo } = useControls();
  const { compareAlgoData, setCurrentAlgorithm } = useAlgorithm();
  useEffect(() => {
    if (compareAlgoData === "clear") {
      setAlgosToCompare([]);
      currentAlgos = [];
    } else if (compareAlgoData) {
      currentAlgos.push({ name: executeAlgo, data: compareAlgoData });
      setAlgosToCompare(currentAlgos);
    }
  }, [compareAlgoData]);
  const handleClearAlgos = () => {
    setExecuteAlgo("A* search");
  };
  const handleAddAlgo = (name) => {
    setExecuteAlgo(name);
  };

  const findData = (name) => {
    return algosToCompare.filter((item) => item.name === name)[0].data;
  };
  const handleShowAlgo = (name) => {
    setCurrentAlgorithm(name);
  };

  const filterAvailableAlgos = (name) => {
    for (let i = 0; i < algosToCompare.length; i++) {
      if (algosToCompare[i].name === name) {
        return false;
      }
    }
    return true;
  };
  return (
    <div className={`${styles.compareAlgoWrapper} ${isCompareOpen ? styles.compareAlgoWrapperOpened : ""}`}>
      <div className={styles.list}>
        <div className={styles.row}>
          <p>Algorithm</p>
          <p>Time</p>
          <p>Length</p>
          <p>Operations</p>
        </div>
        <hr style={{ width: "450px", color: "#353535" }} />
        {algosToCompare.map((item) => {
          const { name, data } = item;
          return (
            <>
              <div className={styles.row} key={name}>
                <p key={name}>{name}</p>
                <p>{round(data.statistics.timeTaken)} ms</p>
                <p>{data.statistics.distance}</p>
                <p>{data.statistics.numberOfVisited}</p>
                <Button onClick={() => handleShowAlgo(name)} text={"Show"} />
              </div>
              <hr style={{ width: "450px", color: "#353535" }} />
            </>
          );
        })}
      </div>
      <footer className={styles.buttons}>
        <Picker name={"Add algo"}>
          <DropdownMenu>
            {pathfindingAlgosList
              .filter((item) => {
                return filterAvailableAlgos(item);
              })
              .map((item) => {
                return <DropdownItem onClick={handleAddAlgo} name={item} />;
              })}
          </DropdownMenu>
        </Picker>
        <Button onClick={handleClearAlgos} styles={{ Background: "red" }} text={"X"} />
      </footer>
    </div>
  );
};

function round(num) {
  let m = Number((Math.abs(num) * 100).toPrecision(15));
  return (Math.round(m) / 100) * Math.sign(num);
}

export default CompareAlgo;
