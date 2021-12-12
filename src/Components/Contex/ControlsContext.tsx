import { createContext, useContext, useState } from "react";

export const Controlls = createContext({} as any);

export const ControlsContext: React.FC<any> = (props) => {
  const [mainPageCommand, setMainPageCommand] = useState("none");
  const [executeAlgo, setExecuteAlgo] = useState(false);
  return (
    <Controlls.Provider
      value={{
        mainPageCommand,
        setMainPageCommand,
        executeAlgo,
        setExecuteAlgo,
      }}
    >
      {props.children}
    </Controlls.Provider>
  );
};

export function useControls() {
  return useContext(Controlls);
}
