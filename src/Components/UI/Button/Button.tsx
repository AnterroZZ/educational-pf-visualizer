import React from "react";
import styles from "./Button.module.css";

interface Props {
  text: string;
  onClick: (event: any) => void;
}
const Button: React.FC<Props> = ({ text, onClick }) => {
  const handleOnClick = (event: any) => {
    onClick(event);
  };

  return (
    <button className={styles.customButton} onClick={handleOnClick}>
      {text}
    </button>
  );
};

export default Button;
