import styles from "./Statistics.module.css";

interface Props {
  currentAlgorithm: string;
  algoStats: {
    distance: number;
    numberOfVisited: number;
    timeTaken: number;
  };
  isStatOpen: boolean;
}
const Statistics: React.FC<Props> = (props) => {
  return (
    <>
      <div className={`${styles.statisticsDialog} ${props.isStatOpen ? styles.statisticsDialogOpened : ""}`}>
        <p>{props.currentAlgorithm}</p>
        <div className={styles.statWrapper}>
          <h4>Time elapsed:</h4>
          <p>{round(props.algoStats.timeTaken)}ms</p>
          <h4>Length of the road:</h4>
          <p>{props.algoStats.distance}</p>
          <h4>Number of operations:</h4>
          <p>{props.algoStats.numberOfVisited}</p>
        </div>
      </div>
    </>
  );
};

function round(num: number) {
  let m = Number((Math.abs(num) * 100).toPrecision(15));
  return (Math.round(m) / 100) * Math.sign(num);
}

export default Statistics;
