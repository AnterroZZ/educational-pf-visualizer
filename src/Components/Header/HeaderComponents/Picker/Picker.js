import { useEffect, useRef, useState } from "react";
import styles from "./Picker.module.css";

const Picker = (props) => {
  const [open, setOpen] = useState(false);
  const currentRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (currentRef.current && !currentRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [currentRef]);
  return (
    <div ref={currentRef} onClick={() => setOpen((prev) => !prev)}>
      <div className={styles.wraper}>
        <p>{props.name}</p>
        <div className={styles.triangle}></div>
      </div>
      {open && props.children}
    </div>
  );
};

export default Picker;
