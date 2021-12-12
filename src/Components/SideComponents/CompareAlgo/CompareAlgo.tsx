import styles from "./CompareAlgo.module.css";
import Button from "../../UI/Button/Button";
import { useEffect, useState } from "react";
import { useControls } from "../../Contex/ControlsContext";
import { useAlgorithm } from "../../Contex/AlgorithmsContext";
import DropdownMenu from "../../Header/HeaderComponents/DropdownMenu/DropdownMenu";
import Picker from "../../Header/HeaderComponents/Picker/Picker";
import DropdownItem from "../../Header/HeaderComponents/DropdownItem/DropdownItem";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
          <p>{t("compare_algo")}</p>
          <p>{t("compare_time")}</p>
          <p>{t("compare_length")}</p>
          <p>{t("compare_operations")}</p>
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
                <Button onClick={() => handleShowAlgo(name)} text={t("compare_show")} />
              </div>
              <hr style={{ width: "450px", color: "#353535" }} />
            </>
          );
        })}
      </div>
      <footer className={styles.buttons}>
        <Picker name={t("compare_add_algorithm")}>
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
