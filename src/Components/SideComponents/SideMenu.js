import SideMenuItem from "./SideMenuItem";
import styles from "./SideMenu.module.css";
const SideMenu = (props) => {
  return (
    <ul className={styles.sidemenu}>
      <SideMenuItem name={"Statistics"} />
      <SideMenuItem name={"Compare algorithms"} />
    </ul>
  );
};

export default SideMenu;
