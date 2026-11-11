import { useState, useEffect, useCallback } from "react";
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
import SiteFooter from "./components/front/site-footer.jsx";
function App() {
  const [assets, setAssets] = useState([]);
  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${import.meta.env.VITE_APP_API_URL}/assets`, { signal: controller.signal })
      .then(({ data }) => setAssets(Array.isArray(data) ? data : []))
      .catch((error) => {
        if (!axios.isCancel(error)) console.error("Unable to load assets", error);
      });
    return () => controller.abort();
  }, []);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("thunderstreams-theme") === "light" ? "light" : "dark";
    } catch {
      return "dark";
    }
  });
  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      try { localStorage.setItem("thunderstreams-theme", next); } catch { /* storage may be unavailable */ }
      return next;
    });
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  const [r, setR] = useState(false);
  const [results, setResults] = useState([]);
  return (
    <div id="top" className="app-shell bg-bubble2 min-h-screen w-full flex flex-col">
      <Nav g={setR} assets={assets} setResults={setResults} theme={theme} toggleTheme={toggleTheme} />
      <AnimatePresence>
        {r ? <PopUp results={results} c={r} g={setR} assets={assets} /> : null}
      </AnimatePresence>
      <main className="app-route-content flex-1">
        <Routes>
          <Route path="/" element={<Home assets={assets} />} />
          <Route path="/anime" element={<Anime assets={assets} />} />

          <Route path="/auth/" element={<Login />} />
          <Route path="/series" element={<Main />} />
          <Route path="/play" element={<MainP />} />
          <Route path="/aboutus" element={<Contact />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;
