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
  student_ime?: string;
  student_prezime?: string;
  institucija_naziv?: string;
  mentor_ime?: string;
  mentor_prezime?: string;
};

type Mentor = {
  id: number;
  ime: string;
  prezime: string;
  email: string;
  role: string;
};

const AllApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchAllApplications = async () => {
    try {
      const res = await axios.get<Application[]>(
        "http://localhost:5000/api/applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications(res.data);
    } catch (error) {
      console.error(error);
      alert("Greška pri dohvaćanju svih prijava.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMentors = async () => {
    try {
      const res = await axios.get<Mentor[]>(
        "http://localhost:5000/api/users/mentors",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMentors(res.data);
    } catch (error) {
      console.error(error);
      alert("Greška pri dohvaćanju mentora.");
    }
  };

  const handleStatusChange = async (applicationId: number, newStatus: string) => {
    try {
      await axios.put(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Status uspješno promijenjen.");
      fetchAllApplications();
    } catch (error) {
      console.error(error);
      alert("Greška pri promjeni statusa.");
    }
  };

  const handleAssignMentor = async (applicationId: number, mentorId: number) => {
    try {
      await axios.put(
        `http://localhost:5000/api/applications/${applicationId}/assign-mentor`,
        { mentor_id: mentorId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Mentor uspješno dodijeljen.");
      fetchAllApplications();
    } catch (error) {
      console.error(error);
      alert("Greška pri dodjeli mentora.");
    }
  };

  useEffect(() => {
    fetchAllApplications();
    fetchMentors();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Sve prijave prakse</h2>

      <Link to="/dashboard">← Natrag na dashboard</Link>

      <br /><br />

      {loading ? (
        <p>Učitavanje...</p>
      ) : applications.length === 0 ? (
        <p>Nema prijava.</p>
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
              <p><strong>Student:</strong> {app.student_ime} {app.student_prezime}</p>
              <p><strong>Institucija:</strong> {app.institucija_naziv || "-"}</p>
              <p><strong>Naziv pozicije:</strong> {app.naziv_pozicije}</p>
              <p><strong>Opis prakse:</strong> {app.opis_prakse}</p>
              <p><strong>Datum početka:</strong> {app.datum_pocetka?.slice(0, 10)}</p>
              <p><strong>Datum završetka:</strong> {app.datum_zavrsetka?.slice(0, 10)}</p>
              <p><strong>Status:</strong> {app.status}</p>
              <p>
                <strong>Mentor:</strong>{" "}
                {app.mentor_ime ? `${app.mentor_ime} ${app.mentor_prezime}` : "Nije dodijeljen"}
              </p>

              <Link to={`/applications/${app.id}`}>Pogledaj detalje</Link>

              <br /><br />

              <label>Promijeni status: </label>
              <select
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) {
                    handleStatusChange(app.id, e.target.value);
                  }
                }}
              >
                <option value="" disabled>
                  Odaberi status
                </option>
                <option value="predano">predano</option>
                <option value="u_obradi">u_obradi</option>
                <option value="odobreno">odobreno</option>
                <option value="u_tijeku">u_tijeku</option>
                <option value="zavrseno">zavrseno</option>
                <option value="odbijeno">odbijeno</option>
              </select>

              <br /><br />

              <label>Dodijeli mentora: </label>
              <select
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) {
                    handleAssignMentor(app.id, Number(e.target.value));
                  }
                }}
              >
                <option value="" disabled>
                  Odaberi mentora
                </option>
                {mentors.map((mentor) => (
                  <option key={mentor.id} value={mentor.id}>
                    {mentor.ime} {mentor.prezime}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllApplicationsPage;