import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import StatusBadge from "../components/StatusBadge";
import { API_BASE, authHeaders, type Application } from "../types";

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<Application[]>(`${API_BASE}/api/applications/my`, { headers: authHeaders() })
      .then((res) => setApplications(res.data))
      .catch(() => alert("Greška pri dohvaćanju mojih prijava."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout title="Moje prijave prakse" subtitle="Pregled svih vaših prijava">
      {loading ? (
        <div className="loading-screen">
          <div className="spinner" />
          Učitavanje...
        </div>
      ) : applications.length === 0 ? (
        <div className="empty-state card">
          <div className="icon">📋</div>
          <h3>Nemate prijava</h3>
          <p>Kreirajte novu prijavu prakse.</p>
          <Link to="/applications/new" className="btn btn-primary" style={{ marginTop: "16px" }}>
            Nova prijava
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {applications.map((app) => (
            <div key={app.id} className="card card-hoverable">
              <div className="flex-between" style={{ flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "8px" }}>
                    {app.naziv_pozicije}
                  </h3>
                  <p className="text-muted">{app.institucija_naziv}</p>
                  <p className="text-muted" style={{ marginTop: "4px" }}>
                    {app.datum_pocetka?.slice(0, 10)} — {app.datum_zavrsetka?.slice(0, 10)}
                  </p>
                  {app.ocjena && (
                    <p style={{ marginTop: "8px" }}>
                      <strong>Ocjena:</strong> {app.ocjena}/5
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
                  <StatusBadge status={app.status} />
                  <Link to={`/applications/${app.id}`} className="btn btn-secondary btn-sm">
                    Detalji →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default MyApplicationsPage;
