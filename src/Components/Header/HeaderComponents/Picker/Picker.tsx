import React, { useEffect, useRef, useState } from "react";
import styles from "./Picker.module.css";

interface Props {
  name: string;
  children: any;
}
const Picker: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const currentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: any) {
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
        <div className={open ? styles.triangleOpen : styles.triangle}></div>
      </div>
      {open && props.children}
    </div>
  );
};

export default Picker;
