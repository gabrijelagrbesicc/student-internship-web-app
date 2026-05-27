import { useEffect, useState } from "react";
import axios from "axios";
import AppLayout from "../components/AppLayout";
import { API_BASE, authHeaders, type Institution } from "../types";

const InstitutionsPage = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [naziv, setNaziv] = useState("");
  const [adresa, setAdresa] = useState("");
  const [grad, setGrad] = useState("");
  const [kontaktEmail, setKontaktEmail] = useState("");
  const [kontaktOsoba, setKontaktOsoba] = useState("");

  const fetchInstitutions = async () => {
    try {
      const res = await axios.get<Institution[]>(`${API_BASE}/api/institutions`, {
        headers: authHeaders(),
      });
      setInstitutions(res.data);
    } catch (error) {
      console.error(error);
      alert("Greška pri dohvaćanju institucija.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!naziv.trim()) {
      alert("Naziv institucije je obavezan.");
      return;
    }

    try {
      await axios.post(
        `${API_BASE}/api/institutions`,
        {
          naziv: naziv.trim(),
          adresa: adresa.trim() || null,
          grad: grad.trim() || null,
          kontakt_email: kontaktEmail.trim() || null,
          kontakt_osoba: kontaktOsoba.trim() || null,
        },
        { headers: authHeaders() }
      );
      alert("Institucija dodana.");
      setNaziv("");
      setAdresa("");
      setGrad("");
      setKontaktEmail("");
      setKontaktOsoba("");
      fetchInstitutions();
    } catch (error) {
      console.error(error);
      alert("Greška pri dodavanju institucije.");
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  return (
    <AppLayout title="Institucije" subtitle={`${institutions.length} institucija u sustavu`}>
      <div className="grid-2" style={{ alignItems: "start" }}>
        <form className="card form-row" onSubmit={handleSubmit}>
          <h3 className="section-title">Dodaj instituciju</h3>
          <div className="form-group">
            <label htmlFor="naziv">Naziv *</label>
            <input id="naziv" type="text" value={naziv} onChange={(e) => setNaziv(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="adresa">Adresa</label>
            <input id="adresa" type="text" value={adresa} onChange={(e) => setAdresa(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="grad">Grad</label>
            <input id="grad" type="text" value={grad} onChange={(e) => setGrad(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Kontakt e-mail</label>
            <input id="email" type="email" value={kontaktEmail} onChange={(e) => setKontaktEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="osoba">Kontakt osoba</label>
            <input id="osoba" type="text" value={kontaktOsoba} onChange={(e) => setKontaktOsoba(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary">
            Spremi instituciju
          </button>
        </form>

        <div className="card">
          <h3 className="section-title">Popis institucija</h3>
          {loading ? (
            <div className="loading-screen">
              <div className="spinner" />
            </div>
          ) : institutions.length === 0 ? (
            <p className="text-muted">Nema institucija.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Naziv</th>
                    <th>Grad</th>
                    <th>Kontakt</th>
                  </tr>
                </thead>
                <tbody>
                  {institutions.map((inst) => (
                    <tr key={inst.id}>
                      <td>{inst.naziv}</td>
                      <td>{inst.grad || "—"}</td>
                      <td>{inst.kontakt_osoba || inst.kontakt_email || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default InstitutionsPage;
