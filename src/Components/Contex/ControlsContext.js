import { createContext, useContext, useState } from "react";

export const Controlls = createContext();

export const ControlsContext = (props) => {
  const [clear, setClear] = useState(false);
  return (
    <Controlls.Provider
      value={{
        clear,
        setClear,
      }}
    >
      {props.children}
    </Controlls.Provider>
  );
};

export function useControls() {
  return useContext(Controlls);
}
