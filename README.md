# Pametna platforma za online učenje (React + Node + MySQL2 + TypeScript)

**Šta radi:** Obaveštenja (sa slikom), nastavni materijali (PDF/TXT), komentari, reakcije (like/dislike), autentifikacija i uloge (profesor/student), kursevi (do 3 pri registraciji).

## Kako pokrenuti

### 1) MySQL baza
Napravi bazu i user-a (ili koristi root).
```sql
CREATE DATABASE smart_elearning CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2) Server
```bash
cd server
cp .env.example .env
# U .env podesi DB_*, JWT_SECRET i CLIENT_ORIGIN po potrebi
npm install
npm run db:setup   # kreira tabele + seed kurseva
npm run dev        # pokreće server na :4000
```

### 3) Klijent
```bash
cd client
cp .env.example .env
npm install
npm run dev        # Vite na :5173
```

Uloguj se / Registruj se. Pri registraciji izaberi do 3 kursa. Profesor može da pravi obaveštenja i dodaje materijale, student može da komentariše i preuzima materijale, a svi mogu da reaguju na obaveštenja. Broj reakcija je vidljiv svima na kursu.

## Napomene
- Token se čuva kao HttpOnly cookie (i vraća se i u JSON-u radi jednostavnosti klijenta).
- Upload lokacije: `server/src/uploads/images` i `server/src/uploads/materials` (već postoje).
- Dozvoljeni tipovi: slike za obaveštenja (png/jpg/webp), materijali PDF/TXT.
- Validacija na serveru (Zod) + provere uloga i upisa na kurs.
- Arhitektura: kontroleri → servisi/repozitorijumi (jednostavno, čisto).
