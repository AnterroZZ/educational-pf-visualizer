import styles from "./Controls.module.css";

const Controls = (name) => {
  return (
    <div className={styles.wraper}>
      <p>Start</p>
      <h5>/</h5>
      <p>Clear walls</p>
    </div>
  );
};

export default Controls;
