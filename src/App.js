import "./App.css";
import { AlgorithmsContext } from "./Components/Contex/AlgorithmsContext";
import { ControlsContext } from "./Components/Contex/ControlsContext";
import Footer from "./Components/Footer/Footer";
import Header from "./Components/Header/Header.js";
import MainPage from "./Components/MainPage/MainPage";

function App() {
  return (
    <ControlsContext>
      <AlgorithmsContext>
        <div className="App">
          <Header />
          <MainPage />
          <Footer />
        </div>
      </AlgorithmsContext>
    </ControlsContext>
  );
}

export default App;
