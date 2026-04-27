import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

type ApplicationDetails = {
  id: number;
  student_id: number;
  institucija_id: number;
  mentor_id: number | null;
  naziv_pozicije: string;
  opis_prakse: string;
  datum_pocetka: string;
  datum_zavrsetka: string;
  status: string;
  ocjena: number | null;
  zavrsno_izvjesce_tekst: string | null;

  student_ime?: string;
  student_prezime?: string;
  student_email?: string;

  institucija_naziv?: string;
  institucija_adresa?: string;
  institucija_grad?: string;
  institucija_kontakt_email?: string;
  institucija_kontakt_osoba?: string;

  mentor_ime?: string;
  mentor_prezime?: string;
};

type DocumentItem = {
  id: number;
  naziv_dokumenta: string;
  tip_dokumenta: string;
  putanja: string;
};

const ApplicationDetailsPage = () => {
  const { id } = useParams();

  const [application, setApplication] = useState<ApplicationDetails | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [nazivDokumenta, setNazivDokumenta] = useState("");
  const [tipDokumenta, setTipDokumenta] = useState("sporazum");
  const [file, setFile] = useState<File | null>(null);

  const token = localStorage.getItem("token");

  const fetchApplication = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/applications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplication(res.data);
    } catch (error) {
      console.error(error);
      alert("Greška pri dohvaćanju detalja.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/documents/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDocuments(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Odaberi dokument.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("prijava_id", String(id));
      formData.append("naziv_dokumenta", nazivDokumenta);
      formData.append("tip_dokumenta", tipDokumenta);
      formData.append("dokument", file);

      await axios.post(
        "http://localhost:5000/api/documents/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Dokument uploadan.");

      setNazivDokumenta("");
      setTipDokumenta("sporazum");
      setFile(null);

      fetchDocuments();
    } catch (error) {
      console.error(error);
      alert("Greška kod uploada.");
    }
  };

  useEffect(() => {
    fetchApplication();
    fetchDocuments();
  }, [id]);

  if (loading) return <p>Učitavanje...</p>;

  if (!application) return <p>Prijava nije pronađena.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Detalji prijave prakse</h2>

      <Link to="/dashboard">← Natrag na dashboard</Link>

      <br />
      <br />

      <div style={{ border: "1px solid gray", padding: "20px" }}>
        <h3>Osnovni podaci</h3>

        <p><strong>ID:</strong> {application.id}</p>
        <p><strong>Pozicija:</strong> {application.naziv_pozicije}</p>
        <p><strong>Opis:</strong> {application.opis_prakse}</p>
        <p><strong>Status:</strong> {application.status}</p>

        <hr />

        <h3>Student</h3>

        <p>
          {application.student_ime} {application.student_prezime}
        </p>

        <p>{application.student_email}</p>

        <hr />

        <h3>Institucija</h3>

        <p>{application.institucija_naziv}</p>
        <p>{application.institucija_adresa}</p>
        <p>{application.institucija_grad}</p>

        <hr />

        <h3>Mentor</h3>

        <p>
          {application.mentor_ime
            ? `${application.mentor_ime} ${application.mentor_prezime}`
            : "Nije dodijeljen"}
        </p>
      </div>

      <br />

      <div style={{ border: "1px solid gray", padding: "20px" }}>
        <h3>Upload dokumenta</h3>

        <input
          type="text"
          placeholder="Naziv dokumenta"
          value={nazivDokumenta}
          onChange={(e) => setNazivDokumenta(e.target.value)}
        />

        <br />
        <br />

        <select
          value={tipDokumenta}
          onChange={(e) => setTipDokumenta(e.target.value)}
        >
          <option value="sporazum">Sporazum</option>
          <option value="projektni_zadatak">Projektni zadatak</option>
          <option value="zavrsno_izvjesce">Završno izvješće</option>
          <option value="ostalo">Ostalo</option>
        </select>

        <br />
        <br />

        <input
          type="file"
          onChange={(e) =>
            setFile(e.target.files ? e.target.files[0] : null)
          }
        />

        <br />
        <br />

        <button onClick={handleUpload}>Upload dokumenta</button>
      </div>

      <br />

      <div style={{ border: "1px solid gray", padding: "20px" }}>
        <h3>Dokumenti</h3>

        {documents.length === 0 ? (
          <p>Nema dokumenata.</p>
        ) : (
          <ul>
            {documents.map((doc) => (
              <li key={doc.id}>
                {doc.naziv_dokumenta} ({doc.tip_dokumenta}){" "}
                <a
                  href={`http://localhost:5000/${doc.putanja}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Otvori
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetailsPage;