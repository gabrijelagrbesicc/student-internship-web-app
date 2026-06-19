import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { API_BASE, authHeaders, type User } from "../types";

type Stats = {
  total: number;
  predano: number;
  odobreno: number;
  u_tijeku: number;
  zavrseno: number;
};

const DashboardPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    axios
      .get<User>(`${API_BASE}/api/users/me`, { headers: authHeaders() })
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("userRole", res.data.role);
        if (res.data.role === "mentor" || res.data.role === "admin") {
          axios
            .get<{ status: string }[]>(`${API_BASE}/api/applications`, { headers: authHeaders() })
            .then((apps) => {
              const list = apps.data;
              setStats({
                total: list.length,
                predano: list.filter((a) => a.status === "predano").length,
                odobreno: list.filter((a) => a.status === "odobreno").length,
                u_tijeku: list.filter((a) => a.status === "u_tijeku").length,
                zavrseno: list.filter((a) => a.status === "zavrseno").length,
              });
            })
            .catch(console.error);
        }
      })
      .catch(console.error);

    axios
      .get<{ procitano: boolean | number }[]>(`${API_BASE}/api/notifications/my`, {
        headers: authHeaders(),
      })
      .then((res) => setUnreadNotifications(res.data.filter((n) => !n.procitano).length))
      .catch(console.error);
  }, []);

  return (
    <AppLayout
      backTo={false}
      title="Dashboard"
      subtitle={user ? `${user.ime} ${user.prezime} — uloga: ${user.role}` : undefined}
    >
      {stats && (user?.role === "mentor" || user?.role === "admin") && (
        <>
          <p><strong>Statistika prijava:</strong></p>
          <div className="stat-grid">
            <div className="stat-card">
              <h3>Ukupno</h3>
              <div className="value">{stats.total}</div>
            </div>
            <div className="stat-card">
              <h3>Predano</h3>
              <div className="value">{stats.predano}</div>
            </div>
            <div className="stat-card">
              <h3>Odobreno</h3>
              <div className="value">{stats.odobreno}</div>
            </div>
            <div className="stat-card">
              <h3>U tijeku</h3>
              <div className="value">{stats.u_tijeku}</div>
            </div>
            <div className="stat-card">
              <h3>Završeno</h3>
              <div className="value">{stats.zavrseno}</div>
            </div>
          </div>
          <hr className="divider" />
        </>
      )}

      <p><strong>Linkovi:</strong></p>
      <div className="quick-links">
        {user?.role === "student" && (
          <>
            <Link to="/applications/new" className="quick-link">Nova prijava prakse</Link>
            <Link to="/applications/my" className="quick-link">Moje prijave</Link>
          </>
        )}
        {(user?.role === "mentor" || user?.role === "admin") && (
          <>
            <Link to="/applications/all" className="quick-link">Sve prijave</Link>
            <Link to="/reports" className="quick-link">Izvještaji</Link>
            <Link to="/institutions" className="quick-link">Institucije</Link>
          </>
        )}
        <Link to="/notifications" className="quick-link">
          Obavijesti{unreadNotifications > 0 ? ` (${unreadNotifications} novo)` : ""}
        </Link>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
