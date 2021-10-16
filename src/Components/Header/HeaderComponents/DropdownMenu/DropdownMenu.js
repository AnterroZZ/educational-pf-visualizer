import styles from "./DropdownMenu.module.css";

const DropdownMenu = (props) => {
  return <ul className={styles.dropdown}>{props.children}</ul>;
};

export default DropdownMenu;
