import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE, authHeaders, type User } from "../types";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [unread, setUnread] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
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

  const closeMenu = () => setMenuOpen(false);

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-top-row">
          <Link to="/dashboard" className="navbar-brand" onClick={closeMenu}>
            Studentska praksa
          </Link>

          <button
            type="button"
            className="navbar-toggle"
            aria-label="Izbornik"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className={`navbar-collapse${menuOpen ? " open" : ""}`}>
          <div className="navbar-links">
            <Link to="/dashboard" className="nav-link" onClick={closeMenu}>Početna</Link>
            {user.role === "student" && (
              <>
                <Link to="/applications/my" className="nav-link" onClick={closeMenu}>Moje prijave</Link>
                <Link to="/applications/new" className="nav-link" onClick={closeMenu}>Nova prijava</Link>
              </>
            )}
            {(user.role === "mentor" || user.role === "admin") && (
              <>
                <Link to="/applications/all" className="nav-link" onClick={closeMenu}>
                  {user.role === "admin" ? "Sve prijave" : "Moji studenti"}
                </Link>
                <Link to="/institutions" className="nav-link" onClick={closeMenu}>Institucije</Link>
              </>
            )}
            {user.role === "admin" && (
              <Link to="/reports" className="nav-link" onClick={closeMenu}>Izvještaji</Link>
            )}
            <Link to="/notifications" className="nav-link" onClick={closeMenu}>
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
      </div>
    </nav>
  );
};

export default Navbar;
