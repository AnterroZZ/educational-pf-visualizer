import styles from "./DropdownMenu.module.css";

interface Props {
  children: any;
}
const DropdownMenu: React.FC<Props> = (props) => {
  return <ul className={styles.dropdown}>{props.children}</ul>;
};

export default DropdownMenu;
