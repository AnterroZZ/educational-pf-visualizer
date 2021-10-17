import { useControls } from "../../../Contex/ControlsContext";
import styles from "./Controls.module.css";

const Controls = (name) => {
  const { setClear } = useControls();
  return (
    <div className={styles.wraper}>
      <p>Start</p>
      <h5>/</h5>
      <p onClick={() => setClear((prev) => !prev)}>Clear walls</p>
    </div>
  );
};

export default Controls;
