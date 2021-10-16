import styles from "./DropdownItem.module.css";

const DropdownItem = (props) => {
  const handleItemChosen = () => {
    props.onClick(props.name);
  };

  return (
    <li onClick={handleItemChosen} className={styles.item}>
      {props.name}
    </li>
  );
};

export default DropdownItem;
