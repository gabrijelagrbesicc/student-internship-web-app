import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../types";
import fsreLogo from "../assets/fsre-logo-white.svg";
import fsreBuilding from "../assets/fsre-building.png";

const RegisterPage = () => {
  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/auth/register`, {
        ime,
        prezime,
        email,
        password,
        role,
      });
      alert("Registracija uspješna!");
      navigate("/login");
    } catch (error: unknown) {
      const msg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Greška kod registracije.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-hero" style={{ backgroundImage: `url(${fsreBuilding})` }}>
      <div className="landing-hero-overlay" aria-hidden="true" />
      <header className="landing-topbar">
        <Link to="/" className="landing-topbar-brand">
          <img src={fsreLogo} alt="FSRE" />
          <span>Sveučilište u Mostaru</span>
        </Link>
      </header>
      <div className="auth-hero-content">
        <div className="auth-card">
          <div className="auth-logo">
            <h1>Registracija</h1>
            <p>Novi korisnik</p>
          </div>
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label>Ime:</label>
              <input type="text" value={ime} onChange={(e) => setIme(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Prezime:</label>
              <input type="text" value={prezime} onChange={(e) => setPrezime(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Lozinka:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Uloga:</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? "Spremanje..." : "Registriraj se"}
            </button>
          </form>
          <p style={{ marginTop: "16px", textAlign: "center" }}>
            <Link to="/login">Natrag na login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
