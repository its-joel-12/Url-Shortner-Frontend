import "./App.css";
import Footer from "./Components/Footer/Footer";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Pages/Home";
import "./index.css";

function App() {
  return (
    <div className="main-app">
      <Navbar />
      <Home />
      <Footer />
    </div>
  );
}

export default App;
