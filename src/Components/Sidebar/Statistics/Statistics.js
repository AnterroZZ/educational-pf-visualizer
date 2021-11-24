import styles from "./Statistics.module.css";

const Statistics = ({ isStatOpen, algoStats }) => {
  return (
    algoStats.numberOfVisited !== 0 &&
    isStatOpen && (
      <div className={styles.statisticsDialog}>
        <p>Dijkstra</p>
        <div className={styles.statWrapper}>
          <h4>Time elapsed:</h4>
          <p>{round(algoStats.timeTaken)}ms</p>
          <h4>Length of the road:</h4>
          <p>{algoStats.distance}</p>
          <h4>Number of operations:</h4>
          <p>{algoStats.numberOfVisited}</p>
        </div>
      </div>
    )
  );
};

function round(num) {
  let m = Number((Math.abs(num) * 100).toPrecision(15));
  return (Math.round(m) / 100) * Math.sign(num);
}

export default Statistics;
