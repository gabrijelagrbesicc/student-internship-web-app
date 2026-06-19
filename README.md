# Web aplikacija za prijavu i evidenciju studentske prakse

## Kako pokrenuti

Trebaš imati instalirano: Node.js i SQL Server.

### 1. Baza

U SQL Server Management Studiju pokreni skripte iz mape `database`:

1. `schema.sql` – napravi bazu i tablice
2. `seed.sql` – ubaci primjer institucija (nije obavezno)

### 2. Backend

```
cd backend
npm install
npm start
```

Prije pokretanja napravi `.env` datoteku (po uzoru na `.env.example`) i upiši
podatke za bazu, JWT i e-mail.

Backend radi na http://localhost:5000

### 3. Frontend

```
cd frontend
npm install
npm run dev
```

Frontend radi na http://localhost:5173
