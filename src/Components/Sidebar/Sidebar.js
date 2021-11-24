import { useEffect, useState } from "react";
import { useAlgorithm } from "../Contex/AlgorithmsContext";
import CompareAlgo from "./CompareAlgo/CompareAlgo";
import styles from "./Sidebar.module.css";
import Statistics from "./Statistics/Statistics";

const Sidebar = () => {
  const [isStatOpen, setIsStatOpen] = useState(false);
  const { algoStats } = useAlgorithm();

  useEffect(() => {
    if (algoStats.numberOfOperations !== 0) {
      setIsStatOpen(true);
    }
  }, [algoStats]);

  return (
    <>
      <div className={styles.wrapper}>
        <p>Statistics</p>
        <div className={styles.triangle}></div>
      </div>
      <Statistics algoStats={algoStats} isStatOpen={isStatOpen} />
      <div className={styles.wrapper2}>
        <p>Compare algo</p>
        <div className={styles.triangle}></div>
      </div>
      <CompareAlgo />
    </>
  );
};

export default Sidebar;
