import "./App.css";
import { AlgorithmsContext } from "./Components/Contex/AlgorithmsContext";
import Footer from "./Components/Footer/Footer";
import Header from "./Components/Header/Header.js";
import MainPage from "./Components/MainPage/MainPage";
import SideMenu from "./Components/SideComponents/SideMenu";

function App() {
  return (
    <AlgorithmsContext>
      <div className="App">
        <Header />
        <MainPage />
        <Footer />
        <SideMenu />
      </div>
    </AlgorithmsContext>
  );
}

export default App;
