import { ArrowRight, Mail, Play, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

function AboutUs() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-eyebrow"><Sparkles size={16} /> YOUR NEXT FAVORITE STORY STARTS HERE</div>
        <h1>Stories worth staying up for.</h1>
        <p>
          Thunder Streams brings your anime watchlist, new discoveries, and favorite
          series together in one place. Find a title, settle in, and enjoy the next episode.
        </p>
        <Link to="/anime" className="about-cta">
          Explore anime <ArrowRight size={18} />
        </Link>
      </section>

      <section className="about-details">
        <article className="about-card">
          <span className="about-icon"><Play size={20} /></span>
          <h2>Find your next series</h2>
          <p>Browse collections by genre and explore titles picked to make choosing your next watch easy.</p>
        </article>
        <article className="about-card">
          <span className="about-icon"><Sparkles size={20} /></span>
          <h2>Made for anime fans</h2>
          <p>A simple place to discover memorable characters, new worlds, and stories to come back to.</p>
        </article>
      </section>

      <section className="about-contact">
        <div>
          <h2>Get in touch</h2>
          <p>Have feedback or a question? We’d love to hear from you.</p>
        </div>
        <a href="mailto:prateekveerbhan@gmail.com" aria-label="Email Thunder Streams">
          <Mail size={18} /> prateekveerbhan@gmail.com
        </a>
      </section>
    </main>
  );
}

export default AboutUs;
