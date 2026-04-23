import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        ime,
        prezime,
        email,
        password,
        role,
      });

      alert("Registracija uspješna!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Greška kod registracije");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Registracija</h2>

      <input
        type="text"
        placeholder="Ime"
        value={ime}
        onChange={(e) => setIme(e.target.value)}
      />
      <br /><br />

      <input
        type="text"
        placeholder="Prezime"
        value={prezime}
        onChange={(e) => setPrezime(e.target.value)}
      />
      <br /><br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Lozinka"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="mentor">Mentor</option>
        <option value="admin">Admin</option>
      </select>
      <br /><br />

      <button onClick={handleRegister}>Registriraj se</button>

      <br /><br />
      <Link to="/">Već imaš račun? Login</Link>
    </div>
  );
};

export default RegisterPage;