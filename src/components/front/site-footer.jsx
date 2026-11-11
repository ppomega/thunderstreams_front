import { ArrowUp, Mail } from "lucide-react";
import { Link } from "react-router-dom";

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <Link to="/" className="site-footer-brand" aria-label="Thunder Streams home">
          <span>Thunder</span><span>Streams</span>
        </Link>
        <p>Find a story. Make it your next favorite.</p>
        <nav className="site-footer-links" aria-label="Footer navigation">
          <Link to="/">Home</Link>
          <Link to="/anime">Anime</Link>
          <Link to="/aboutus">About us</Link>
          <a href="mailto:prateekveerbhan@gmail.com" aria-label="Email us"><Mail size={17} /></a>
          <a href="#top" aria-label="Back to top"><ArrowUp size={17} /></a>
        </nav>
      </div>
      <div className="site-footer-bottom">
        <span>© {new Date().getFullYear()} Thunder Streams</span>
        <span>Made for anime fans</span>
      </div>
    </footer>
  );
}

export default SiteFooter;
