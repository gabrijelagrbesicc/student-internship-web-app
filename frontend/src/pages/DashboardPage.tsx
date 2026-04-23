import { useEffect, useState } from "react";
import axios from "axios";

type User = {
  id: number;
  ime: string;
  prezime: string;
  email: string;
  role: "student" | "mentor" | "admin";
  created_at?: string;
};

const DashboardPage = () => {
  const [user, setUser] = useState<User | null>(null);

  const fetchMe = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get<User>("http://localhost:5000/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
    } catch (error) {
      console.error(error);
      alert("Greška pri dohvaćanju korisnika.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      {user ? (
        <div>
          <p><strong>Ime:</strong> {user.ime}</p>
          <p><strong>Prezime:</strong> {user.prezime}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Uloga:</strong> {user.role}</p>

          <br />
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Učitavanje...</p>
      )}
    </div>
  );
};

export default DashboardPage;