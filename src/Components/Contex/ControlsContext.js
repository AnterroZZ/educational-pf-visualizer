import { createContext, useContext, useState } from "react";

export const Controlls = createContext();

export const ControlsContext = (props) => {
  const [clear, setClear] = useState("none");
  const [language, setLanguage] = useState("english");
  return (
    <Controlls.Provider
      value={{
        clear,
        setClear,
        language,
        setLanguage,
      }}
    >
      {props.children}
    </Controlls.Provider>
  );
};

export function useControls() {
  return useContext(Controlls);
}
