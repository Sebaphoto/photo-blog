# Setup del tuo archivio fotografico

## Cosa ti serve (tutto gratuito)
- Account [Supabase](https://supabase.com) — database e storage foto
- Account [Vercel](https://vercel.com) — hosting
- Account [GitHub](https://github.com) — per il deploy

---

## Passo 1 — Supabase

1. Vai su [supabase.com](https://supabase.com) → **New project**
2. Scegli un nome (es. "photo-blog") e una password per il database
3. Vai su **Settings → API** e copia:
   - `Project URL` → sarà `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → sarà `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Crea la tabella posts
Vai su **SQL Editor** e incolla:

```sql
create table posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  cover_url text not null,
  photos text[] default '{}',
  published boolean default false,
  created_at timestamptz default now()
);

-- Permetti lettura pubblica dei post pubblicati
alter table posts enable row level security;
create policy "Lettura pubblica" on posts for select using (published = true);
create policy "Admin tutto" on posts for all using (auth.role() = 'authenticated');
```

### Crea lo storage per le foto
1. Vai su **Storage** → **New bucket**
2. Nome: `photos`
3. Spunta **Public bucket** → Create
4. Vai su **Policies** dello storage → aggiungi:
   - SELECT: per tutti (`true`)
   - INSERT: solo autenticati (`auth.role() = 'authenticated'`)

### Crea il tuo account
1. Vai su **Authentication → Users** → **Invite user**
2. Inserisci la tua email — riceverai un link per impostare la password
3. Questa email sarà `ADMIN_EMAIL` nel file `.env.local`

---

## Passo 2 — Configurazione locale

```bash
# Nella cartella photo-blog
cp .env.local.example .env.local
```

Modifica `.env.local` con i tuoi dati:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXTAUTH_SECRET=una_stringa_casuale_lunga_almeno_32_caratteri
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=tua@email.com
```

Per generare `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

---

## Passo 3 — Prova in locale

```bash
cd photo-blog
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)
- Galleria pubblica: `/`
- Login admin: `/login`
- Pannello admin: `/admin`

---

## Passo 4 — Deploy su Vercel

1. Carica il progetto su GitHub:
   ```bash
   git init
   git add .
   git commit -m "primo commit"
   git remote add origin https://github.com/tuo-username/photo-blog.git
   git push -u origin main
   ```

2. Vai su [vercel.com](https://vercel.com) → **New Project** → importa da GitHub

3. Nella sezione **Environment Variables**, aggiungi le stesse variabili di `.env.local`, MA cambia:
   ```
   NEXTAUTH_URL=https://tuo-dominio.vercel.app
   ```
   (Vercel ti darà il dominio durante il setup)

4. Clicca **Deploy** — in 2 minuti è online!

---

## Come usare il sito

### Pubblicare una foto
1. Vai su `/login` → accedi con email e password
2. Click **Nuovo post**
3. Inserisci titolo, descrizione, trascina le foto
4. Clicca la ★ sulla foto che vuoi come copertina
5. Attiva l'interruttore **Pubblicato** → **Pubblica post**

### Modificare un post
- Dal pannello admin → click sull'icona matita ✏️

### Aggiornare il sito dopo modifiche al codice
Ogni `git push` su GitHub rilancia automaticamente il deploy su Vercel.
