import styles from "./Button.module.css";

const Button = ({ text, onClick }) => {
  const handleOnClick = (event) => {
    onClick(event);
  };
  return <button onClick={handleOnClick}>{text}</button>;
};

export default Button;
