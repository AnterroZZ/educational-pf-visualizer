import styles from "./CompareAlgo.module.css";
import Button from "../../UI/Button/Button";
const CompareAlgo = () => {
  const handleClearAlgos = () => {};
  const handleAddAlgo = () => {};
  const handleShowAlgo = (name) => {};
  return (
    <div className={styles.compareAlgo}>
      <div className={styles.header}>
        <p>Algorithm</p>
        <p>Time</p>
        <p>Length</p>
        <p>Operations</p>
      </div>
      <div className={styles.algosWrapper}>
        <p>Dijkstra</p>
        <p>2ms</p>
        <p>35</p>
        <p>623</p>
        <Button text={"Show"} />
        <p>Dijkstra</p>
        <p>2ms</p>
        <p>35</p>
        <p>623</p>
        <Button text={"Show"} />
      </div>
      <div className={styles.buttons}>
        <Button onClick={handleAddAlgo} text={"Add algo"} />
        <Button onClick={handleClearAlgos} styles={{ Background: "red" }} text={"X"} />
      </div>
    </div>
  );
};

export default CompareAlgo;
