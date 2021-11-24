import "./App.css";
import { AlgorithmsContext } from "./Components/Contex/AlgorithmsContext";
import { ControlsContext } from "./Components/Contex/ControlsContext";
import Footer from "./Components/Footer/Footer";
import Header from "./Components/Header/Header.js";
import MainPage from "./Components/MainPage/MainPage";
import Sidebar from "./Components/Sidebar/Sidebar";

function App() {
  return (
    <ControlsContext>
      <AlgorithmsContext>
        <div className="App">
          <Header />
          <MainPage />
          <Footer />
          <Sidebar />
        </div>
      </AlgorithmsContext>
    </ControlsContext>
  );
}

export default App;
