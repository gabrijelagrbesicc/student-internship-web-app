import { useEffect, useState } from "react";
import axios from "axios";
import AppLayout from "../components/AppLayout";
import { API_BASE, authHeaders, STATUS_OPTIONS } from "../types";

type StatusRow = { status: string; broj: number };
type InstitutionRow = { institucija_naziv: string | null; broj: number };

type ReportData = {
  ukupno: number;
  po_statusu: StatusRow[];
  po_instituciji: InstitutionRow[];
};

const statusLabel = (status: string) =>
  STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status;

const ReportsPage = () => {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<ReportData>(`${API_BASE}/api/applications/reports`, { headers: authHeaders() })
      .then((res) => setReport(res.data))
      .catch(() => alert("Greška pri učitavanju izvještaja."))
      .finally(() => setLoading(false));
  }, []);

  const downloadCsv = () => {
    if (!report) return;

    const lines: string[] = [
      "Izvještaj - studentska praksa",
      `Ukupno prijava;${report.ukupno}`,
      "",
      "Status;Broj",
      ...report.po_statusu.map((r) => `${statusLabel(r.status)};${r.broj}`),
      "",
      "Institucija;Broj prijava",
      ...report.po_instituciji.map(
        (r) => `${r.institucija_naziv || "Nepoznato"};${r.broj}`
      ),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "izvjestaj_prakse.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <AppLayout title="Izvještaji">
        <div className="loading-screen">
          <div className="spinner" />
          Učitavanje...
        </div>
      </AppLayout>
    );
  }

  if (!report) {
    return (
      <AppLayout title="Izvještaji">
        <p className="text-muted">Nema podataka za izvještaj.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Izvještaji"
      subtitle={`Ukupno prijava: ${report.ukupno}`}
      actions={
        <button type="button" className="btn btn-primary btn-sm" onClick={downloadCsv}>
          Preuzmi CSV
        </button>
      }
    >
      <div className="card" style={{ marginBottom: "16px" }}>
        <h3 className="section-title">Prijave po statusu</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Broj</th>
              </tr>
            </thead>
            <tbody>
              {report.po_statusu.map((row) => (
                <tr key={row.status}>
                  <td>{statusLabel(row.status)}</td>
                  <td>{row.broj}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Prijave po instituciji</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Institucija</th>
                <th>Broj prijava</th>
              </tr>
            </thead>
            <tbody>
              {report.po_instituciji.map((row, i) => (
                <tr key={i}>
                  <td>{row.institucija_naziv || "Nepoznato"}</td>
                  <td>{row.broj}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default ReportsPage;
