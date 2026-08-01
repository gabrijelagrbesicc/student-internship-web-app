import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE, authHeaders, type User } from "../types";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [unread, setUnread] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get<User>(`${API_BASE}/api/users/me`, { headers: authHeaders() })
      .then((r) => {
        setUser(r.data);
        localStorage.setItem("userRole", r.data.role);
      })
      .catch(() => {});

    axios
      .get<{ procitano: boolean | number }[]>(`${API_BASE}/api/notifications/my`, {
        headers: authHeaders(),
      })
      .then((r) => setUnread(r.data.filter((n) => !n.procitano).length))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-brand">
          Studentska praksa
        </Link>

        <div className="navbar-links">
          <Link to="/dashboard" className="nav-link">Početna</Link>
          {user.role === "student" && (
            <>
              <Link to="/applications/my" className="nav-link">Moje prijave</Link>
              <Link to="/applications/new" className="nav-link">Nova prijava</Link>
            </>
          )}
          {(user.role === "mentor" || user.role === "admin") && (
            <>
              <Link to="/applications/all" className="nav-link">
                {user.role === "admin" ? "Sve prijave" : "Moji studenti"}
              </Link>
              <Link to="/institutions" className="nav-link">Institucije</Link>
            </>
          )}
          {user.role === "admin" && (
            <Link to="/reports" className="nav-link">Izvještaji</Link>
          )}
          <Link to="/notifications" className="nav-link">
            Obavijesti{unread > 0 ? ` (${unread})` : ""}
          </Link>
        </div>

        <div className="navbar-actions">
          <span>{user.ime} ({user.role})</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Odjava
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
