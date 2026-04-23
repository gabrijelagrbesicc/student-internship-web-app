import { useEffect, useState } from "react";
import axios from "axios";

type Institution = {
  id: number;
  naziv: string;
};

const NewApplicationPage = () => {
  const [institucije, setInstitucije] = useState<Institution[]>([]);
  const [institucijaId, setInstitucijaId] = useState("");
  const [nazivPozicije, setNazivPozicije] = useState("");
  const [opisPrakse, setOpisPrakse] = useState("");
  const [datumPocetka, setDatumPocetka] = useState("");
  const [datumZavrsetka, setDatumZavrsetka] = useState("");

  const token = localStorage.getItem("token");

  const fetchInstitutions = async () => {
    try {
      const res = await axios.get<Institution[]>(
        "http://localhost:5000/api/institutions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setInstitucije(res.data);
    } catch (error) {
      console.error(error);
      alert("Greška pri dohvaćanju institucija.");
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/applications",
        {
          institucija_id: Number(institucijaId),
          naziv_pozicije: nazivPozicije,
          opis_prakse: opisPrakse,
          datum_pocetka: datumPocetka,
          datum_zavrsetka: datumZavrsetka,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Prijava prakse uspješno dodana.");

      setInstitucijaId("");
      setNazivPozicije("");
      setOpisPrakse("");
      setDatumPocetka("");
      setDatumZavrsetka("");
    } catch (error) {
      console.error(error);
      alert("Greška pri slanju prijave.");
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Nova prijava prakse</h2>

      <select
        value={institucijaId}
        onChange={(e) => setInstitucijaId(e.target.value)}
      >
        <option value="">Odaberi instituciju</option>
        {institucije.map((inst) => (
          <option key={inst.id} value={inst.id}>
            {inst.naziv}
          </option>
        ))}
      </select>

      <br /><br />

      <input
        type="text"
        placeholder="Naziv pozicije"
        value={nazivPozicije}
        onChange={(e) => setNazivPozicije(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Opis prakse"
        value={opisPrakse}
        onChange={(e) => setOpisPrakse(e.target.value)}
      />

      <br /><br />

      <input
        type="date"
        value={datumPocetka}
        onChange={(e) => setDatumPocetka(e.target.value)}
      />

      <br /><br />

      <input
        type="date"
        value={datumZavrsetka}
        onChange={(e) => setDatumZavrsetka(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSubmit}>Pošalji prijavu</button>
    </div>
  );
};

export default NewApplicationPage;