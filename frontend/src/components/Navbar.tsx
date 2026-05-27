import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE, authHeaders, type User } from "../types";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [unread, setUnread] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

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
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!user) return null;

  const isActive = (path: string) => (location.pathname === path ? "nav-link active" : "nav-link");

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-brand">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
          Studentska<span>Praksa</span>
        </Link>

        <div className="navbar-links">
          <Link to="/dashboard" className={isActive("/dashboard")}>
            Dashboard
          </Link>
          {user.role === "student" && (
            <>
              <Link to="/applications/my" className={isActive("/applications/my")}>
                Moje prijave
              </Link>
              <Link to="/applications/new" className={isActive("/applications/new")}>
                Nova prijava
              </Link>
            </>
          )}
          {(user.role === "mentor" || user.role === "admin") && (
            <>
              <Link to="/applications/all" className={isActive("/applications/all")}>
                Sve prijave
              </Link>
              <Link to="/reports" className={isActive("/reports")}>
                Izvještaji
              </Link>
              <Link to="/institutions" className={isActive("/institutions")}>
                Institucije
              </Link>
            </>
          )}
        </div>

        <div className="navbar-actions">
          <div className="nav-user">
            <span>{user.ime} {user.prezime}</span>
            <span className={`role-badge ${user.role}`}>{user.role}</span>
          </div>
          <Link to="/notifications" className="btn btn-ghost btn-sm notif-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unread > 0 && <span className="notif-dot" />}
          </Link>
          <button type="button" onClick={handleLogout} className="btn btn-ghost btn-sm" title="Odjava">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
