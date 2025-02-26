import { useState, useEffect } from "react";
import Nav from "./components/front/nav.jsx";
import axios from "axios";
import PopUp from "./components/front/popup.jsx";
import { AnimatePresence } from "framer-motion";
import { Route, Routes } from "react-router";
import Login from "./components/login/login.jsx";
import MainP from "./components/player/mainp.jsx";
import Home from "./components/front/home.jsx";
import Main from "./components/section/main.jsx";
import Anime from "./components/front/anime.jsx";
import Contact from "./components/front/aboutus.jsx";
function App() {
  const [assets, setAssets] = useState([]);
  async function Fetch() {
    let config = {
      method: "GET",
      url: `${import.meta.env.VITE_APP_API_URL}/assets`,
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
