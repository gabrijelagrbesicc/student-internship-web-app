import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../types";

type LoginResponse = {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
    ime: string;
    prezime: string;
  };
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post<LoginResponse>(`${API_BASE}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", res.data.user.role);
      navigate("/dashboard");
    } catch (error) {
      alert("Greška kod logina - provjeri email i lozinku.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>Studentska praksa</h1>
          <p>Prijava u sustav</p>
        </div>
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Lozinka:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Prijava..." : "Login"}
          </button>
        </form>
        <p style={{ marginTop: "16px", textAlign: "center" }}>
          <Link to="/register">Registracija</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
