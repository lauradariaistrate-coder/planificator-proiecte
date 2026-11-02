# Planificator proiecte

Planificator pentru proiectele unui birou de arhitectură:
- plan pe zile;
- ore lucrate, cu limita de 8 h pe zi;
- concediu și activități Admin;
- termene și alerte;
- livrabile în paralel;
- autorizații și avize (CU, AC, avize cu termen legal);
- sinteze, KPI și raport lunar Word.

Rulează în browser, pe orice calculator. Datele echipei stau într-o bază de date **Supabase** (gratuită), iar aplicația e găzduită pe **GitHub Pages** (gratuit).

## Instalare (o singură dată, ~15 minute)

### 1. Baza de date – Supabase
1. Cont gratuit pe https://supabase.com → **New project**. Alegi o parolă de bază de date și regiunea Frankfurt.
2. În proiect: **SQL Editor** → **New query** → lipești conținutul fișierului `supabase/schema.sql` → **Run**.
3. **Project Settings → API**: copiezi **Project URL** și cheia **anon public**.

### 2. Aplicația – GitHub Pages
1. Cont gratuit pe https://github.com → **New repository** `planificator-proiecte` (Private sau Public).
2. **Add file → Upload files**: încarci tot conținutul acestui folder (`index.html`, `shim.js`, `config.js`, `.nojekyll`, `supabase/`, `README.md`).
3. Opțional: în `config.js` completezi `url` și `key` de la pasul 1.3. Așa, colegii introduc doar codul echipei.
4. **Settings → Pages** → Source: *Deploy from a branch* → `main` / `(root)` → Save.
   După 1–2 minute, aplicația e la `https://<utilizator>.github.io/planificator-proiecte/`.
   - Pentru Pages pe un repository *Private* e nevoie de un plan GitHub plătit. Cu planul gratuit, repository-ul trebuie să fie *Public*.
   - Codul fiind public nu e o problemă: datele nu sunt în cod, ci în Supabase, și sunt protejate de codul echipei.

### 3. Prima pornire
1. Deschizi linkul. Completezi adresa și cheia Supabase (dacă nu sunt în `config.js`) și apeși **Creez o echipă nouă**. Se generează un cod secret de echipă.
2. **Sunt nou / nouă în planificator**: numele și parola ta.
3. Colegii deschid același link și introduc **codul echipei**, pe care îl găsești în Profil → Echipa. Apoi își creează numele și parola.

Altă echipă sau altă persoană poate folosi același link cu alt cod de echipă (planificator separat). La fel merge și cu propria bază Supabase.

## Date existente (opțional)
Dacă ai o copie `planificator-backup-….json`: la prima pornire, în fereastra „Cine ești?”, apeși **Restaurez dintr-o copie de siguranță**.

## Aplicație pe Windows
În `Instaleaza Planificator.bat` înlocuiești linkul din `$url` cu linkul GitHub Pages, apoi rulezi .bat-ul.

## Securitate
- Cheia *anon* Supabase e publică prin natura ei. Rândurile din baza de date se văd doar cu **codul echipei** (regula RLS din `schema.sql`), care are minim 20 de caractere. Codul echipei se păstrează ca o parolă.
- Parolele persoanelor se salvează doar ca hash SHA-256 cu sare.
- Este o protecție potrivită pentru uz intern. Pentru date sensibile se recomandă și autentificare Supabase (email).

## Modificări
`index.html` e o singură pagină. Orice asistent (Claude etc.) o poate modifica. După modificare o încarci din nou în GitHub (Upload files, cu înlocuire). Datele nu se pierd, pentru că stau în Supabase.

## Ce nu se mută automat din varianta Claude
Emailurile zilnice programate (8:47 / 16:50) au fost sarcini programate în contul Claude. Pop-up-urile zilnice din aplicație și notificările Windows (.bat) funcționează și aici.
