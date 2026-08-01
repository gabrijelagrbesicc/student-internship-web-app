import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { API_BASE, authHeaders, type Institution } from "../types";

const POZICIJA_PRIJEDLOG: Record<string, string> = {
  "Atlantbh d.o.o.": "Software Developer Intern",
  "Logosoft d.o.o.": "Web Developer Intern",
  "Mistral Technologies": "Backend Developer Intern",
  "BH Telecom d.d.": "Telekomunikacijski inženjer pripravnik",
  "Aluminij d.d.": "Inženjer strojarstva pripravnik",
  "Sveučilište u Mostaru": "Studentski suradnik u nastavi",
  "Infobip": "Software Engineer Intern",
};

const NewApplicationPage = () => {
  const [institucije, setInstitucije] = useState<Institution[]>([]);
  const [institucijaId, setInstitucijaId] = useState("");
  const [nazivPozicije, setNazivPozicije] = useState("");
  const [opisPrakse, setOpisPrakse] = useState("");
  const [datumPocetka, setDatumPocetka] = useState("");
  const [datumZavrsetka, setDatumZavrsetka] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<Institution[]>(`${API_BASE}/api/institutions`, { headers: authHeaders() })
      .then((res) => setInstitucije(res.data))
      .catch(() => alert("Greška pri dohvaćanju institucija."));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institucijaId || !nazivPozicije || !opisPrakse || !datumPocetka || !datumZavrsetka) {
      alert("Molimo popunite sva polja.");
      return;
    }
    if (datumPocetka > datumZavrsetka) {
      alert("Datum početka ne može biti nakon datuma završetka.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_BASE}/api/applications`,
        {
          institucija_id: Number(institucijaId),
          naziv_pozicije: nazivPozicije,
          opis_prakse: opisPrakse,
          datum_pocetka: datumPocetka,
          datum_zavrsetka: datumZavrsetka,
        },
        { headers: authHeaders() }
      );
      alert("Prijava prakse uspješno poslana!");
      navigate("/applications/my");
    } catch (error) {
      console.error(error);
      alert("Greška pri slanju prijave.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Nova prijava prakse" subtitle="Ispunite podatke o odabranoj praksi">
      <form className="card form-row" onSubmit={handleSubmit} style={{ maxWidth: "560px" }}>
        <div className="form-group">
          <label htmlFor="institucija">Institucija / tvrtka</label>
          <select
            id="institucija"
            value={institucijaId}
            onChange={(e) => {
              const noviId = e.target.value;
              setInstitucijaId(noviId);
              const odabrana = institucije.find((inst) => String(inst.id) === noviId);
              if (odabrana) {
                setNazivPozicije(POZICIJA_PRIJEDLOG[odabrana.naziv] ?? "");
              }
            }}
            required
          >
            <option value="">Odaberite instituciju</option>
            {institucije.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.naziv}{inst.grad ? ` (${inst.grad})` : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="pozicija">Naziv pozicije</label>
          <input
            id="pozicija"
            type="text"
            placeholder="npr. Software Developer Intern"
            value={nazivPozicije}
            onChange={(e) => setNazivPozicije(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="opis">Opis prakse</label>
          <textarea
            id="opis"
            placeholder="Opis zadataka i ciljeva prakse..."
            value={opisPrakse}
            onChange={(e) => setOpisPrakse(e.target.value)}
            required
          />
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label htmlFor="pocetak">Datum početka</label>
            <input
              id="pocetak"
              type="date"
              value={datumPocetka}
              onChange={(e) => setDatumPocetka(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="zavrsetak">Datum završetka</label>
            <input
              id="zavrsetak"
              type="date"
              value={datumZavrsetka}
              onChange={(e) => setDatumZavrsetka(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
          {loading ? "Slanje..." : "Pošalji prijavu"}
        </button>
      </form>
    </AppLayout>
  );
};

export default NewApplicationPage;
