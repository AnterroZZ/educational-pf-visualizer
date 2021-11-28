import { createContext, useContext, useState } from "react";

export const Controlls = createContext();

export const ControlsContext = (props) => {
  const [mainPageCommand, setMainPageCommand] = useState("none");
  const [language, setLanguage] = useState("english");
  const [executeAlgo, setExecuteAlgo] = useState(false);
  return (
    <Controlls.Provider
      value={{
        mainPageCommand,
        setMainPageCommand,
        language,
        setLanguage,
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
