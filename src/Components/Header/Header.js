import Controls from "./HeaderComponents/Controls/Controls";
import Picker from "./HeaderComponents/Picker/Picker";
import styles from "./Header.module.css";
import DropdownMenu from "./HeaderComponents/DropdownMenu/DropdownMenu";
import DropdownItem from "./HeaderComponents/DropdownItem/DropdownItem";
import { useAlgorithm } from "../Contex/AlgorithmsContext";

const Header = () => {
  const { setCurrentAlgorithm } = useAlgorithm();

  const handleAlgoritmsChosen = (name) => {
    setCurrentAlgorithm(name);
    console.log(`Current algorithm set to: ${name}`);
  };

  const handleMazeChosen = (name) => {
    console.log(name);
  };
  return (
    <div className={styles.wraper}>
      <h2>Pathfinding algorithms</h2>
      <h2 className={styles.divider}>/</h2>
      <Picker name="Algorithms">
        <DropdownMenu>
          <DropdownItem onClick={handleAlgoritmsChosen} name={"A* search"} />
          <DropdownItem
            onClick={handleAlgoritmsChosen}
            name={"Dijkstra's algorithm"}
          />
          <DropdownItem
            onClick={handleAlgoritmsChosen}
            name={"Depth first search"}
          />
          <DropdownItem
            onClick={handleAlgoritmsChosen}
            name={"Breadth first search"}
          />
        </DropdownMenu>
      </Picker>
      <h3>/</h3>
      <Picker name="Generate maze">
        <DropdownMenu>
          <DropdownItem onClick={handleMazeChosen} name={"Random maze"} />

          <DropdownItem
            onClick={handleMazeChosen}
            name={"Recursive division"}
          />
        </DropdownMenu>
      </Picker>
      <h2 className={styles.divider}>/</h2>
      <Controls />
    </div>
  );
};

export default Header;
