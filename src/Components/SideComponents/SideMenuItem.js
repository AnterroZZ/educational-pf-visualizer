import styles from "./SideMenuItem.module.css";

const SideMenuItem = (props) => {
  return (
    <li>
      <div className={styles.blabla}>
        <div className={styles.triangle}></div>
        <div>{props.name}</div>
      </div>
    </li>
  );
};

export default SideMenuItem;
