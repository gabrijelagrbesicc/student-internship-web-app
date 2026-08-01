import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import StatusBadge from "../components/StatusBadge";
import {
  API_BASE,
  authHeaders,
  statusLabel,
  DOC_TYPE_OPTIONS,
  type Application,
  type DocumentItem,
} from "../types";

type StatusHistoryItem = {
  id: number;
  stari_status: string | null;
  novi_status: string;
  datum_promjene: string;
  promijenio_ime?: string;
  promijenio_prezime?: string;
};

const docTypeLabel = (tip: string) =>
  DOC_TYPE_OPTIONS.find((d) => d.value === tip)?.label ?? tip;

const ApplicationDetailsPage = () => {
  const { id } = useParams();
  const [application, setApplication] = useState<Application | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [nazivDokumenta, setNazivDokumenta] = useState("");
  const [tipDokumenta, setTipDokumenta] = useState("sporazum");
  const [file, setFile] = useState<File | null>(null);

  const [ocjena, setOcjena] = useState<number>(5);
  const [zavrsnoIzvjesce, setZavrsnoIzvjesce] = useState("");

  const userRole = localStorage.getItem("userRole");
  const isMentorOrAdmin = userRole === "mentor" || userRole === "admin";

  const fetchApplication = async () => {
    try {
      const res = await axios.get<Application>(`${API_BASE}/api/applications/${id}`, {
        headers: authHeaders(),
      });
      setApplication(res.data);
      if (res.data.ocjena) setOcjena(res.data.ocjena);
      if (res.data.zavrsno_izvjesce_tekst) setZavrsnoIzvjesce(res.data.zavrsno_izvjesce_tekst);
    } catch (error) {
      console.error(error);
      alert("Greška pri dohvaćanju prijave.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await axios.get<DocumentItem[]>(`${API_BASE}/api/documents/${id}`, {
        headers: authHeaders(),
      });
      setDocuments(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStatusHistory = async () => {
    try {
      const res = await axios.get<StatusHistoryItem[]>(
        `${API_BASE}/api/applications/${id}/status-history`,
        { headers: authHeaders() }
      );
      setStatusHistory(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = async () => {
    if (!file || !nazivDokumenta) {
      alert("Unesite naziv i odaberite datoteku.");
      return;
    }

    const formData = new FormData();
    formData.append("prijava_id", String(id));
    formData.append("naziv_dokumenta", nazivDokumenta);
    formData.append("tip_dokumenta", tipDokumenta);
    formData.append("dokument", file);

    try {
      await axios.post(`${API_BASE}/api/documents/upload`, formData, {
        headers: { ...authHeaders(), "Content-Type": "multipart/form-data" },
      });
      alert("Dokument uspješno uploadan!");
      setNazivDokumenta("");
      setFile(null);
      fetchDocuments();
    } catch {
      alert("Greška pri uploadu.");
    }
  };

  const handleGrade = async () => {
    try {
      await axios.put(
        `${API_BASE}/api/applications/${id}/grade`,
        { ocjena, zavrsno_izvjesce_tekst: zavrsnoIzvjesce },
        { headers: authHeaders() }
      );
      alert("Ocjena i izvješće spremljeni!");
      fetchApplication();
    } catch {
      alert("Greška pri spremanju ocjene.");
    }
  };

  useEffect(() => {
    fetchApplication();
    fetchDocuments();
    fetchStatusHistory();
  }, [id]);

  if (loading) {
    return (
      <AppLayout title="Detalji prijave">
        <p>Učitavanje...</p>
      </AppLayout>
    );
  }

  if (!application) {
    return (
      <AppLayout title="Detalji prijave">
        <p className="text-muted">Prijava nije pronađena.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={`Prijava #${application.id}`}
      subtitle={application.naziv_pozicije}
      actions={<StatusBadge status={application.status} />}
    >
      <div className="card">
        <h3 className="section-title">Osnovni podaci</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <strong>Opis prakse</strong>
            <span>{application.opis_prakse}</span>
          </div>
          <div className="detail-item">
            <strong>Trajanje</strong>
            <span>
              {application.datum_pocetka?.slice(0, 10)} — {application.datum_zavrsetka?.slice(0, 10)}
            </span>
          </div>
          {application.ocjena && (
            <div className="detail-item">
              <strong>Ocjena</strong>
              <span>{application.ocjena}/5</span>
            </div>
          )}
          {application.zavrsno_izvjesce_tekst && (
            <div className="detail-item" style={{ gridColumn: "1 / -1" }}>
              <strong>Završno izvješće</strong>
              <span>{application.zavrsno_izvjesce_tekst}</span>
            </div>
          )}
        </div>

        <div className="divider" />

        <div className="grid-2">
          <div>
            <h3 className="section-title">Student</h3>
            <p>
              {application.student_ime} {application.student_prezime}
            </p>
            <p className="text-muted">{application.student_email}</p>
          </div>
          <div>
            <h3 className="section-title">Institucija</h3>
            <p><strong>{application.institucija_naziv}</strong></p>
            <p className="text-muted">
              {application.institucija_adresa}, {application.institucija_grad}
            </p>
            {application.mentor_ime && (
              <p style={{ marginTop: "8px" }}>
                <strong>Mentor:</strong> {application.mentor_ime} {application.mentor_prezime}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Povijest statusa</h3>
        {statusHistory.length === 0 ? (
          <p className="text-muted">Još nema zabilježenih promjena statusa.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Stari status</th>
                  <th>Novi status</th>
                  <th>Promijenio</th>
                </tr>
              </thead>
              <tbody>
                {statusHistory.map((item) => (
                  <tr key={item.id}>
                    <td>{new Date(item.datum_promjene).toLocaleString("hr-HR")}</td>
                    <td>{item.stari_status ? statusLabel(item.stari_status) : "—"}</td>
                    <td>{statusLabel(item.novi_status)}</td>
                    <td>
                      {item.promijenio_ime
                        ? `${item.promijenio_ime} ${item.promijenio_prezime}`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="section-title">Upload dokumenta</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="docName">Naziv dokumenta</label>
            <input
              id="docName"
              type="text"
              value={nazivDokumenta}
              onChange={(e) => setNazivDokumenta(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="docType">Tip</label>
            <select id="docType" value={tipDokumenta} onChange={(e) => setTipDokumenta(e.target.value)}>
              {DOC_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="docFile">Datoteka (PDF, DOC, DOCX)</label>
            <input
              id="docFile"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <button type="button" className="btn btn-primary" onClick={handleUpload}>
            Upload
          </button>
        </div>
      </div>

      {isMentorOrAdmin && (
        <div className="card">
          <h3 className="section-title">Ocjenjivanje i završno izvješće</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ocjena">Ocjena</label>
              <select id="ocjena" value={ocjena} onChange={(e) => setOcjena(Number(e.target.value))}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="izvjesce">Komentar / završno izvješće</label>
              <textarea
                id="izvjesce"
                value={zavrsnoIzvjesce}
                onChange={(e) => setZavrsnoIzvjesce(e.target.value)}
                rows={5}
              />
            </div>
            <button type="button" className="btn btn-primary" onClick={handleGrade}>
              Spremi ocjenu i izvješće
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="section-title">Dokumenti ({documents.length})</h3>
        {documents.length === 0 ? (
          <p className="text-muted">Nema dokumenata.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Naziv</th>
                  <th>Tip</th>
                  <th>Datum</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.naziv_dokumenta}</td>
                    <td>{docTypeLabel(doc.tip_dokumenta)}</td>
                    <td>
                      {doc.upload_date
                        ? new Date(doc.upload_date).toLocaleDateString("hr-HR")
                        : "—"}
                    </td>
                    <td>
                      <a
                        href={`${API_BASE}/${doc.putanja.replace(/\\/g, "/")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-ghost btn-sm"
                      >
                        Otvori
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ApplicationDetailsPage;
