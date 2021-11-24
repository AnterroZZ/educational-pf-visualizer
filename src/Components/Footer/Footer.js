import { useEffect, useState } from "react";
import { useAlgorithm } from "../Contex/AlgorithmsContext";
import styles from "./Footer.module.css";
const Footer = () => {
  const [isStatOpen, setIsStatOpen] = useState(false);
  const { algoStats } = useAlgorithm();

  useEffect(() => {
    if (algoStats.numberOfOperations !== 0) {
      setIsStatOpen(true);
    }
  }, [algoStats]);
  return (
    <div className={styles.wraper}>
      {/* <p onClick={() => setIsStatOpen((prevState) => !prevState)}>Statistics</p>
      <Statistics algoStats={algoStats} isStatOpen={isStatOpen} />
      <p>Compare algo</p>
      <CompareAlgo /> */}
    </div>
  );
};

export default Footer;
