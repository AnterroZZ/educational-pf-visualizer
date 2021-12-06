import styles from "./CompareAlgo.module.css";
import Button from "../../UI/Button/Button";
import { useEffect, useState } from "react";
import { useControls } from "../../Contex/ControlsContext";
import { useAlgorithm } from "../../Contex/AlgorithmsContext";
import DropdownMenu from "../../Header/HeaderComponents/DropdownMenu/DropdownMenu";
import Picker from "../../Header/HeaderComponents/Picker/Picker";
import DropdownItem from "../../Header/HeaderComponents/DropdownItem/DropdownItem";
const pathfindingAlgosList = [
  "A* search",
  "Dijkstra's algorithm",
  "Depth first search",
  "Breadth first search",
  "Best first search",
];

interface Props {
  isCompareOpen: boolean;
}
interface Algorithm {
  name: string;
  data: any;
}

const CompareAlgo: React.FC<Props> = ({ isCompareOpen }) => {
  const [algosToCompare, setAlgosToCompare] = useState<Array<Algorithm>>([]);
  const { setExecuteAlgo } = useControls();
  const { compareAlgoData, setCurrentAlgorithm } = useAlgorithm();
  useEffect(() => {
    if (compareAlgoData === "clear") {
      setAlgosToCompare([]);
      setExecuteAlgo("None");
    } else if (compareAlgoData) {
      setAlgosToCompare((prev) => [...prev, { name: compareAlgoData.name, data: compareAlgoData.data }]);
    }
  }, [compareAlgoData, setExecuteAlgo]);
  const handleClearAlgos = () => {
    setAlgosToCompare([]);
  };
  const handleAddAlgo = (name: string) => {
    setExecuteAlgo(name);
  };

  const handleShowAlgo = (name: string) => {
    setCurrentAlgorithm(name);
  };

  const isAlgorithmAvailable = (name: string) => {
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
              .filter((algorithm) => {
                return isAlgorithmAvailable(algorithm);
              })
              .map((item, index, arr) => {
                //TODO: key fix
                return <DropdownItem key={arr[index]} onClick={handleAddAlgo} name={item} />;
              })}
          </DropdownMenu>
        </Picker>
        <Button onClick={handleClearAlgos} text={"X"} />
      </footer>
    </div>
  );
};

function round(num: number) {
  let m = Number((Math.abs(num) * 100).toPrecision(15));
  return (Math.round(m) / 100) * Math.sign(num);
}

export default CompareAlgo;
