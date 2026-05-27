# Web aplikacija za prijavu i evidenciju studentske prakse

Završni rad — digitalizacija procesa prijave, odobravanja i praćenja studentske prakse.

## Tehnologije

| Sloj | Tehnologija |
|------|-------------|
| Frontend | React 19, TypeScript, Vite, React Router |
| Backend | Node.js, Express 5 |
| Baza | Microsoft SQL Server |
| Autentifikacija | JWT + bcrypt |
| E-mail | Nodemailer (SMTP / Gmail OAuth) |
| Dokumenti | Multer (upload u `backend/uploads/`) |

## Uloge korisnika

- **Student** — prijava prakse, pregled statusa, upload dokumenata, obavijesti
- **Mentor** — pregled prijava, promjena statusa, dodjela mentora, ocjena i izvješće, izvještaji
- **Admin** — isto kao mentor + upravljanje institucijama (API)

## Statusi prijave

`predano` → `u_obradi` → `odobreno` → `u_tijeku` → `zavrseno` (ili `odbijeno`)

Svaka promjena statusa zapisuje se u `status_history`, šalje e-mail studentu i stvara in-app obavijest.

## Struktura projekta

```
zavrsni-studentskapraksa/
├── backend/          # Express API
├── frontend/         # React aplikacija
├── database/         # SQL skripte (schema + seed)
└── README.md
```

## Preduvjeti

- Node.js 18+
- SQL Server (lokalno ili Express edition)
- npm

## Instalacija baze

1. Pokreni SQL Server Management Studio (ili `sqlcmd`).
2. Izvrši skripte redom:

```sql
-- database/schema.sql   — kreira bazu i tabele
-- database/seed.sql     — primjer institucija (opcionalno)
```

Baza se zove **`studentskaPraksa`**. Tabele: `users`, `institucije`, `prijave_prakse`, `status_history`, `dokumenti`, `notifikacije`.

## Pokretanje aplikacije

### 1. Backend

```powershell
cd backend
copy .env.example .env
# uredi .env — DB podatke, JWT_SECRET, SMTP
npm install
npm start
```

Backend radi na **http://localhost:5000**.

### 2. Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend radi na **http://localhost:5173**.

### 3. Test korisnici

Registriraj korisnike na `/register` (student, mentor, admin). Lozinke se automatski hashiraju.

Za test e-maila postavi `FORCE_EMAIL_TO=tvoj@email.com` u `backend/.env` — svi mailovi će ići na tu adresu.

## API rute (sažetak)

| Metoda | Ruta | Uloga | Opis |
|--------|------|-------|------|
| POST | `/api/auth/register` | — | Registracija |
| POST | `/api/auth/login` | — | Prijava |
| GET | `/api/users/me` | auth | Trenutni korisnik |
| GET | `/api/users/mentors` | auth | Lista mentora |
| GET | `/api/institutions` | auth | Lista institucija |
| POST | `/api/institutions` | admin, mentor | Nova institucija |
| POST | `/api/applications` | student | Nova prijava |
| GET | `/api/applications/my` | student | Moje prijave |
| GET | `/api/applications` | mentor, admin | Sve prijave |
| GET | `/api/applications/reports` | mentor, admin | Izvještaji |
| GET | `/api/applications/:id` | auth | Detalji prijave |
| PUT | `/api/applications/:id/status` | mentor, admin | Promjena statusa |
| PUT | `/api/applications/:id/assign-mentor` | mentor, admin | Dodjela mentora |
| PUT | `/api/applications/:id/grade` | mentor, admin | Ocjena / izvješće |
| GET | `/api/documents/:applicationId` | auth | Dokumenti prijave |
| POST | `/api/documents/upload` | auth | Upload (PDF/DOC/DOCX) |
| GET | `/api/notifications/my` | auth | Moje obavijesti |
| PUT | `/api/notifications/read-all` | auth | Označi sve pročitano |

Svi zaštićeni endpointi traže header: `Authorization: Bearer <token>`.

## Frontend stranice

| Ruta | Uloga | Opis |
|------|-------|------|
| `/` | — | Login |
| `/register` | — | Registracija |
| `/dashboard` | sve | Početna s linkovima |
| `/applications/new` | student | Nova prijava |
| `/applications/my` | student | Moje prijave |
| `/applications/all` | mentor, admin | Sve prijave + filteri |
| `/applications/:id` | sve | Detalji, dokumenti, ocjena |
| `/reports` | mentor, admin | Izvještaji + CSV |
| `/notifications` | sve | In-app obavijesti |

## E-mail konfiguracija (Gmail)

1. U Google računu uključi **2-step verification**.
2. Generiraj **App password** (Sigurnost → Lozinke za aplikacije).
3. U `backend/.env`:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tvoj@gmail.com
SMTP_PASS=app_password_16_znakova
```

## Implementirane nadogradnje (za završni rad)

1. **Workflow statusa** — 6 statusa + povijest u `status_history`
2. **Upload dokumenata** — sporazum, projektni zadatak, završno izvješće, ostalo
3. **E-mail obavijesti** — automatski mail pri promjeni statusa
4. **In-app notifikacije** — tablica `notifikacije`, stranica Obavijesti
5. **Filtriranje** — pretraga, status, institucija (Sve prijave)
6. **Izvještaji** — po statusu i instituciji, preuzimanje CSV

## Poznata ograničenja / moguća proširenja

- Admin UI za upravljanje institucijama (API postoji, frontend stranica nije)
- Prikaz povijesti statusa na stranici detalja prijave
- `notifikacije.tip` u bazi dopušta samo `sustav` ili `email`

## Licenca

Projekt za potrebe završnog rada.
