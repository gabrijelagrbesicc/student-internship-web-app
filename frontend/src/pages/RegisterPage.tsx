import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../types";

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
      alert("Registracija uspješna! Sada se možete prijaviti.");
      navigate("/");
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
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>Studentska<span>Praksa</span></h1>
          <p>Registracija novog korisnika</p>
        </div>
        <form className="auth-form" onSubmit={handleRegister}>
          <div className="grid-2">
            <div className="form-group">
              <label htmlFor="ime">Ime</label>
              <input id="ime" type="text" value={ime} onChange={(e) => setIme(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="prezime">Prezime</label>
              <input id="prezime" type="text" value={prezime} onChange={(e) => setPrezime(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Lozinka</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="role">Uloga</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="mentor">Mentor</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? "Registracija..." : "Registriraj se"}
          </button>
        </form>
        <p className="text-muted" style={{ textAlign: "center", marginTop: "24px" }}>
          <Link to="/" style={{ color: "var(--accent)" }}>
            Već imaš račun? Prijavi se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
