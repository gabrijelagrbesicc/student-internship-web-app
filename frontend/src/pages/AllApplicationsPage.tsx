import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import StatusBadge from "../components/StatusBadge";
import {
  API_BASE,
  authHeaders,
  STATUS_OPTIONS,
  type Application,
  type Institution,
  type User,
} from "../types";

type Mentor = Pick<User, "id" | "ime" | "prezime">;

const FILTER_STATUS_OPTIONS = [{ value: "", label: "Svi statusi" }, ...STATUS_OPTIONS];

const AllApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [institutionFilter, setInstitutionFilter] = useState("");
  const [statusDraft, setStatusDraft] = useState<Record<number, string>>({});
  const [mentorDraft, setMentorDraft] = useState<Record<number, string>>({});
  const isAdmin = localStorage.getItem("userRole") === "admin";

  const fetchApplications = async () => {
    try {
      const res = await axios.get<Application[]>(`${API_BASE}/api/applications`, {
        headers: authHeaders(),
      });
      setApplications(res.data);
      const statusInit: Record<number, string> = {};
      const mentorInit: Record<number, string> = {};
      res.data.forEach((app) => {
        statusInit[app.id] = app.status;
        mentorInit[app.id] = app.mentor_id ? String(app.mentor_id) : "";
      });
      setStatusDraft(statusInit);
      setMentorDraft(mentorInit);
    } catch (error) {
      console.error(error);
      alert("Greška pri dohvaćanju prijava.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: number) => {
    const newStatus = statusDraft[applicationId];
    if (!newStatus) return;
    try {
      await axios.put(
        `${API_BASE}/api/applications/${applicationId}/status`,
        { status: newStatus },
        { headers: authHeaders() }
      );
      alert("Status uspješno promijenjen.");
      fetchApplications();
    } catch (error) {
      console.error(error);
      alert("Greška pri promjeni statusa.");
    }
  };

  const handleAssignMentor = async (applicationId: number) => {
    const mentorId = mentorDraft[applicationId];
    if (!mentorId) {
      alert("Odaberi mentora.");
      return;
    }
    try {
      await axios.put(
        `${API_BASE}/api/applications/${applicationId}/assign-mentor`,
        { mentor_id: Number(mentorId) },
        { headers: authHeaders() }
      );
      alert("Mentor uspješno dodijeljen.");
      fetchApplications();
    } catch (error) {
      console.error(error);
      alert("Greška pri dodjeli mentora.");
    }
  };

  const filteredApplications = applications.filter((app) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      app.student_ime?.toLowerCase().includes(q) ||
      app.student_prezime?.toLowerCase().includes(q) ||
      app.naziv_pozicije?.toLowerCase().includes(q) ||
      app.institucija_naziv?.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || app.status === statusFilter;
    const matchesInstitution =
      !institutionFilter || app.institucija_id === Number(institutionFilter);
    return matchesSearch && matchesStatus && matchesInstitution;
  });

  useEffect(() => {
    fetchApplications();
    if (isAdmin) {
      axios
        .get<Mentor[]>(`${API_BASE}/api/users/mentors`, { headers: authHeaders() })
        .then((res) => setMentors(res.data))
        .catch(console.error);
    }
    axios
      .get<Institution[]>(`${API_BASE}/api/institutions`, { headers: authHeaders() })
      .then((res) => setInstitutions(res.data))
      .catch(console.error);
  }, []);

  return (
    <AppLayout
      title={isAdmin ? "Sve prijave prakse" : "Moji studenti"}
      subtitle={`${filteredApplications.length} prijava`}
    >
      <div className="filter-bar card" style={{ padding: "16px" }}>
        <div className="form-group">
          <label>Pretraga</label>
          <input
            type="text"
            placeholder="Student, pozicija, institucija..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {FILTER_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Institucija</label>
          <select value={institutionFilter} onChange={(e) => setInstitutionFilter(e.target.value)}>
            <option value="">Sve institucije</option>
            {institutions.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.naziv}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Učitavanje...</p>
      ) : filteredApplications.length === 0 ? (
        <div className="card">
          <p>Nema prijava.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredApplications.map((app) => (
            <div key={app.id} className="card">
              <div className="flex-between" style={{ flexWrap: "wrap", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "6px" }}>
                    #{app.id} — {app.naziv_pozicije}
                  </h3>
                  <p className="text-muted">
                    {app.student_ime} {app.student_prezime} · {app.institucija_naziv || "—"}
                  </p>
                  <p className="text-muted" style={{ marginTop: "4px" }}>
                    Mentor:{" "}
                    {app.mentor_ime ? `${app.mentor_ime} ${app.mentor_prezime}` : "Nije dodijeljen"}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <StatusBadge status={app.status} />
                  <Link to={`/applications/${app.id}`} className="btn btn-secondary btn-sm">
                    Detalji
                  </Link>
                </div>
              </div>

              <div className="divider" />

              <div className={isAdmin ? "grid-2" : ""}>
                <div>
                  <label>Promijeni status</label>
                  <div className="form-actions">
                    <select
                      value={statusDraft[app.id] ?? app.status}
                      onChange={(e) =>
                        setStatusDraft((prev) => ({ ...prev, [app.id]: e.target.value }))
                      }
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleStatusChange(app.id)}
                    >
                      Spremi status
                    </button>
                  </div>
                </div>
                {isAdmin && (
                  <div>
                    <label>Dodijeli mentora</label>
                    <div className="form-actions">
                      <select
                        value={mentorDraft[app.id] ?? ""}
                        onChange={(e) =>
                          setMentorDraft((prev) => ({ ...prev, [app.id]: e.target.value }))
                        }
                      >
                        <option value="">— Odaberi mentora —</option>
                        {mentors.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.ime} {m.prezime}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleAssignMentor(app.id)}
                      >
                        Spremi mentora
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default AllApplicationsPage;
