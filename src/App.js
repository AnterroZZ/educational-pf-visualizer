import "./App.css";
import { AlgorithmsContext } from "./Components/Contex/AlgorithmsContext";
import Footer from "./Components/Footer/Footer";
import Header from "./Components/Header/Header.js";
import MainPage from "./Components/MainPage/MainPage";

function App() {
  return (
    <AlgorithmsContext>
      <div className="App">
        <Header />
        <MainPage />
        <Footer />
      </div>
    </AlgorithmsContext>
  );
}

export default App;
