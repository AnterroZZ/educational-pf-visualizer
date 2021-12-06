import { useEffect, useState } from "react";
import { useAlgorithm } from "../Contex/AlgorithmsContext";
import CompareAlgo from "../SideComponents/CompareAlgo/CompareAlgo";
import styles from "./Sidebar.module.css";
import Statistics from "../SideComponents/Statistics/Statistics";

const Sidebar = () => {
  const [isStatOpen, setIsStatOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const { algoStats, currentAlgorithm } = useAlgorithm();

  useEffect(() => {
    if (algoStats.numberOfVisited > 0) {
      setIsStatOpen(true);
    }
  }, [algoStats]);

  const handleOnClickStatistics = () => {
    if (algoStats.numberOfVisited !== 0) {
      setIsStatOpen((previous) => !previous);
    }
  };

  return (
    <>
      <div onClick={handleOnClickStatistics} className={`${styles.stats} ${styles.sidePanel}`}>
        <p>Statistics</p>
        <div className={isStatOpen && algoStats.numberOfVisited !== 0 ? styles.triangleOpened : styles.triangle}></div>
      </div>
      <Statistics currentAlgorithm={currentAlgorithm} algoStats={algoStats} isStatOpen={isStatOpen} />
      <div
        onClick={() => setIsCompareOpen((previous) => !previous)}
        className={`${styles.compare} ${styles.sidePanel}`}
      >
        <p>Compare algo</p>
        <div className={isCompareOpen ? styles.triangleOpened : styles.triangle}></div>
      </div>
      <CompareAlgo isCompareOpen={isCompareOpen} />
    </>
  );
};

export default Sidebar;
