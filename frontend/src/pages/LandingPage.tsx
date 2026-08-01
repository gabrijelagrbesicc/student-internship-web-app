import { Link } from "react-router-dom";
import fsreLogo from "../assets/fsre-logo-white.svg";
import fsreBuilding from "../assets/fsre-building.png";

const LandingPage = () => (
  <div className="landing-page">
    <div className="landing-hero" style={{ backgroundImage: `url(${fsreBuilding})` }}>
      <div className="landing-hero-overlay" aria-hidden="true" />

      <header className="landing-topbar">
        <a href="https://fsre.sum.ba/" target="_blank" rel="noreferrer" className="landing-topbar-brand">
          <img src={fsreLogo} alt="FSRE" />
          <span>Sveučilište u Mostaru</span>
        </a>
      </header>

      <div className="landing-hero-content">
        <p className="landing-org">Prijava i evidencija studentske prakse</p>
        <h1>Studentska praksa</h1>
        <Link to="/register" className="landing-cta">
          <span>Registriraj se</span>
          <span className="landing-cta-arrow" aria-hidden="true">→</span>
        </Link>
        <p className="landing-alt-action">
          Već imaš račun? <Link to="/login">Prijavi se</Link>
        </p>
      </div>
    </div>
  </div>
);

export default LandingPage;
