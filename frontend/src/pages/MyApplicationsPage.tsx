import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

type Application = {
  id: number;
  student_id: number;
  institucija_id: number;
  mentor_id: number | null;
  naziv_pozicije: string;
  opis_prakse: string;
  datum_pocetka: string;
  datum_zavrsetka: string;
  status: string;
  created_at: string;
  institucija_naziv?: string;
};

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get<Application[]>(
        "http://localhost:5000/api/applications/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications(res.data);
    } catch (error) {
      console.error(error);
      alert("Greška pri dohvaćanju prijava.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyApplications();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Moje prijave prakse</h2>

      <Link to="/dashboard">← Natrag na dashboard</Link>

      <br /><br />

      {loading ? (
        <p>Učitavanje...</p>
      ) : applications.length === 0 ? (
        <p>Nemaš još nijednu prijavu.</p>
      ) : (
        <div>
          {applications.map((app) => (
            <div
              key={app.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "8px",
                backgroundColor: "#fff",
              }}
            >
              <p><strong>ID prijave:</strong> {app.id}</p>
              <p><strong>Institucija:</strong> {app.institucija_naziv || "-"}</p>
              <p><strong>Naziv pozicije:</strong> {app.naziv_pozicije}</p>
              <p><strong>Opis prakse:</strong> {app.opis_prakse}</p>
              <p><strong>Datum početka:</strong> {app.datum_pocetka?.slice(0, 10)}</p>
              <p><strong>Datum završetka:</strong> {app.datum_zavrsetka?.slice(0, 10)}</p>
              <p><strong>Status:</strong> {app.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;