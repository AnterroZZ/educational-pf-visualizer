import styles from "./DropdownItem.module.css";

interface Props {
  onClick: (name: string) => void;
  name: string;
}
const DropdownItem: React.FC<Props> = (props) => {
  const handleItemChosen = () => {
    props.onClick(props.name);
  };

  return (
    <li key={Math.random()} onClick={handleItemChosen} className={styles.item}>
      {props.name}
    </li>
  );
};

export default DropdownItem;
