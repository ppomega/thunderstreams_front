import { useState, useEffect } from "react";
import Nav from "./components/front/nav";
import axios from "axios";
import PopUp from "./components/front/popup";
import { AnimatePresence } from "framer-motion";
import { Route, Routes } from "react-router";
import Login from "./components/login/login";
import MainP from "./components/player/mainp";
import Home from "./components/front/home";
import { NavLink } from "react-router-dom";
import Main from "./components/section/main";
import Anime from "./components/front/anime";
import Contact from "./components/front/aboutus";

function App() {
  const [assets, setAssets] = useState([]);
  async function Fetch() {
    let config = {
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/assets`,
    };
    const list = await axios.request(config);
    setAssets(list.data);
  }
  useEffect(() => {
    Fetch();
  }, []);
  const [r, setR] = useState(false);
  const [results, setResults] = useState([]);
  return (
    <div className="bg-bubble2 min-h-screen backdrop-blur-sm w-full">
      <Nav g={setR} assets={assets} setResults={setResults} />
      <AnimatePresence>
        {r ? <PopUp results={results} c={r} g={setR} assets={assets} /> : null}
      </AnimatePresence>
      <Routes>
        <Route path="/" element={<Home assets={assets} />} />
        <Route path="/anime" element={<Anime assets={assets} />} />

        <Route path="/auth/" element={<Login />} />
        <Route path="/series" element={<Main />} />
        <Route path="/play" element={<MainP />} />
        <Route path="/aboutus" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
