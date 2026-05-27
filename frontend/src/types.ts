export type Role = "student" | "mentor" | "admin";

export type Status = "predano" | "u_obradi" | "odobreno" | "u_tijeku" | "zavrseno" | "odbijeno";

export interface User {
  id: number;
  ime: string;
  prezime: string;
  email: string;
  role: Role;
  created_at?: string;
}

export interface Application {
  id: number;
  student_id: number;
  institucija_id: number;
  mentor_id: number | null;
  naziv_pozicije: string;
  opis_prakse: string;
  datum_pocetka: string;
  datum_zavrsetka: string;
  status: Status;
  ocjena?: number | null;
  zavrsno_izvjesce_tekst?: string | null;
  created_at: string;
  institucija_naziv?: string;
  student_ime?: string;
  student_prezime?: string;
  student_email?: string;
  institucija_adresa?: string;
  institucija_grad?: string;
  institucija_kontakt_email?: string;
  institucija_kontakt_osoba?: string;
  mentor_ime?: string;
  mentor_prezime?: string;
}

export interface Institution {
  id: number;
  naziv: string;
  adresa?: string;
  grad?: string;
  kontakt_email?: string;
  kontakt_osoba?: string;
}

export interface Notification {
  id: number;
  korisnik_id: number;
  poruka: string;
  tip: string;
  procitano: boolean | number;
  created_at: string;
}

export interface DocumentItem {
  id: number;
  prijava_id: number;
  naziv_dokumenta: string;
  tip_dokumenta: string;
  putanja: string;
  upload_date?: string;
}

export const STATUS_OPTIONS = [
  { value: "predano", label: "Predano" },
  { value: "u_obradi", label: "U obradi" },
  { value: "odobreno", label: "Odobreno" },
  { value: "u_tijeku", label: "U tijeku" },
  { value: "zavrseno", label: "Zavrseno" },
  { value: "odbijeno", label: "Odbijeno" },
] as const;

export const statusLabel = (status: string): string =>
  STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status;

export const DOC_TYPE_OPTIONS = [
  { value: "sporazum", label: "Sporazum o praksi" },
  { value: "projektni_zadatak", label: "Projektni zadatak" },
  { value: "zavrsno_izvjesce", label: "Zavrsno izvjesce" },
  { value: "ostalo", label: "Ostalo" },
];

export const API_BASE = "http://localhost:5000";

export const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});