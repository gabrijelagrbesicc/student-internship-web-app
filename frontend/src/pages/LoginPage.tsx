import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

type LoginResponse = {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post<LoginResponse>(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);

      alert("Login uspješan!");
      console.log(res.data);

      navigate("/dashboard");
    } catch (error) {
      alert("Greška kod logina");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

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

      <button onClick={handleLogin}>Login</button>
      <br /><br />
        <Link to="/register">Nemaš račun? Registriraj se</Link>

    </div>
  );
};

export default LoginPage;