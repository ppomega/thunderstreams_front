import { useNavigate } from "react-router";
import { Moon, Sun } from "lucide-react";
import { useEffect, useRef } from "react";

function Nav(props) {
  const navigate = useNavigate();
  const searchTimer = useRef();
  useEffect(() => () => clearTimeout(searchTimer.current), []);
  function query(q) {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      const term = q.toLocaleLowerCase().trim().replace(/\s+/g, "");
      props.setResults(term ? props.assets.filter((asset) =>
        asset.name?.toLocaleLowerCase().replace(/\s+/g, "").includes(term)
      ) : []);
    }, 120);
  }
  return (
    <nav className="app-nav sticky top-0 z-50 w-full font-g">
      <div className="app-nav-inner">
        <button type="button" className="nav-link" onClick={() => navigate("/")}>
          Home
        </button>
        <button type="button" className="nav-link" onClick={() => navigate("/anime")}>
          Anime
        </button>

        <input
          id="l"
          onChange={(e) => query(e.target.value)}
          onFocus={() => props.g(true)}
          className="nav-search h-10 bg-bubb bg-opacity-65 px-4 text-base text-white rounded-lg"
          placeholder="Search titles"
          aria-label="Search titles"
        />

        <div className="nav-brand font-o" aria-label="Thunder Streams">
          <span>Thunder</span><span className="text-yellow-300">Streams</span>
        </div>
        <button type="button" className="nav-link" onClick={() => navigate("/aboutus")}>
          About Us
        </button>
        <button
          type="button"
          onClick={props.toggleTheme}
          className="theme-toggle"
          aria-label={`Switch to ${props.theme === "dark" ? "light" : "dark"} theme`}
          title={`Switch to ${props.theme === "dark" ? "light" : "dark"} theme`}
        >
          {props.theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </nav>
  );
}
export default Nav;
