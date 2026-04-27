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
  created_at: string;

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

const ApplicationDetailsPage = () => {
  const { id } = useParams();
  const [application, setApplication] = useState<ApplicationDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchApplication = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get<ApplicationDetails>(
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
      alert("Greška pri dohvaćanju detalja prijave.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  if (loading) {
    return <p style={{ padding: "20px" }}>Učitavanje...</p>;
  }

  if (!application) {
    return <p style={{ padding: "20px" }}>Prijava nije pronađena.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Detalji prijave prakse</h2>

      <Link to="/dashboard">← Natrag na dashboard</Link>

      <br /><br />

      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        <h3>Osnovni podaci</h3>
        <p><strong>ID prijave:</strong> {application.id}</p>
        <p><strong>Naziv pozicije:</strong> {application.naziv_pozicije}</p>
        <p><strong>Opis prakse:</strong> {application.opis_prakse}</p>
        <p><strong>Status:</strong> {application.status}</p>
        <p><strong>Datum početka:</strong> {application.datum_pocetka?.slice(0, 10)}</p>
        <p><strong>Datum završetka:</strong> {application.datum_zavrsetka?.slice(0, 10)}</p>

        <hr />

        <h3>Student</h3>
        <p>
          <strong>Ime i prezime:</strong>{" "}
          {application.student_ime} {application.student_prezime}
        </p>
        <p><strong>Email:</strong> {application.student_email}</p>

        <hr />

        <h3>Institucija</h3>
        <p><strong>Naziv:</strong> {application.institucija_naziv}</p>
        <p><strong>Adresa:</strong> {application.institucija_adresa || "-"}</p>
        <p><strong>Grad:</strong> {application.institucija_grad || "-"}</p>
        <p><strong>Kontakt email:</strong> {application.institucija_kontakt_email || "-"}</p>
        <p><strong>Kontakt osoba:</strong> {application.institucija_kontakt_osoba || "-"}</p>

        <hr />

        <h3>Mentor</h3>
        <p>
          {application.mentor_ime
            ? `${application.mentor_ime} ${application.mentor_prezime}`
            : "Mentor nije dodijeljen"}
        </p>

        <hr />

        <h3>Završna evidencija</h3>
        <p><strong>Ocjena:</strong> {application.ocjena || "Nije unesena"}</p>
        <p>
          <strong>Završno izvješće:</strong>{" "}
          {application.zavrsno_izvjesce_tekst || "Nije uneseno"}
        </p>
      </div>
    </div>
  );
};

export default ApplicationDetailsPage;