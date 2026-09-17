# 75 Medium

Mobiele webapp voor een team van 6 om de "75 Medium" challenge bij te houden: dagelijkse taken afvinken, water bijhouden, de week en een kalender zien, elkaars voortgang volgen, en achteraf dagen corrigeren.

## Stack

- **Client**: React + Vite + TypeScript (`client/`)
- **API**: Azure Functions v4, Node/TypeScript (`api/`)
- **Data**: Azure Table Storage, 2 tabellen (`DailyLogs`, `UserSettings`)
- **Lokale ontwikkeling**: Azurite (Table Storage emulator) + `func start` + Vite dev server

Alle "dag-rekenkunde" (dag X van Y, extra dagen door gemiste taken, streak) wordt uitsluitend server-side berekend in [`api/src/shared/challengeMath.ts`](api/src/shared/challengeMath.ts), altijd opnieuw uit de opgeslagen logs — dus achteraf een dag aanpassen werkt direct correct door, zonder aparte synchronisatiestap. Zie [`api/tests/challengeMath.test.ts`](api/tests/challengeMath.test.ts) voor alle geteste randgevallen.

## Lokaal draaien

Vereist: Node.js 18+.

```bash
npm install
npm run dev
```

Dit start gelijktijdig:
- **Azurite** (Table Storage emulator, lokaal in `.azurite/`)
- **Azure Functions host** op `http://localhost:7071`
- **Vite dev server** op `http://localhost:5173` (proxyt `/api/*` naar de Functions host)

Open `http://localhost:5173` in de browser. Log in met een van de codes uit [`api/src/shared/users.ts`](api/src/shared/users.ts) (standaard bv. `ray123`, `noortje123`, ...).

Lokale data staat in `.azurite/` (gitignored) — verwijder die map om met een schone lei te beginnen.

### Codes aanpassen

De 6 teamleden en hun inlogcodes staan hardcoded in [`api/src/shared/users.ts`](api/src/shared/users.ts). Pas de `code` velden aan voordat de app echt in gebruik gaat.

### Taken en tekst aanpassen

De standaardteksten van de 6 dagelijkse taken staan in [`api/src/shared/constants.ts`](api/src/shared/constants.ts) (`DEFAULT_TASK_LABELS`). Iedere gebruiker kan zijn/haar eigen teksten daarnaast aanpassen via het instellingenscherm in de app — nieuwe taken toevoegen is (bewust) nog niet ondersteund.

## Azure deployment (handmatig)

De app is gebouwd om zonder codewijzigingen over te zetten naar echte Azure resources — er hoeft alleen configuratie ingevuld te worden.

1. **Storage Account** aanmaken (Standard, LRS is voldoende) — deze levert de Table Storage die de API gebruikt.
2. **Static Web App** aanmaken en koppelen aan de GitHub repo, met:
   - `app_location`: `client`
   - `output_location`: `dist`
   - `api_location`: `api`

   Azure genereert dan automatisch een GitHub Actions workflow die bij elke push naar main zowel de client bouwt als de API als gekoppelde ("managed") Function App deployt — dus geen aparte Function App resource nodig, en dit valt onder de gratis SWA-laag.
3. In de Static Web App resource → **Configuration** → **Application settings**, deze twee waarden toevoegen (dit zijn nu placeholders in `api/local.settings.json`, lokaal):
   - `TABLES_CONNECTION_STRING`: de connection string van de Storage Account uit stap 1
   - `AUTH_SECRET`: een lange willekeurige string (bv. via `openssl rand -hex 32`) — wordt gebruikt om login-tokens te ondertekenen
4. Opnieuw deployen (of wachten op de eerstvolgende push) — de tabellen (`DailyLogs`, `UserSettings`) worden automatisch aangemaakt bij het eerste gebruik.

`staticwebapp.config.json` in de root regelt de SPA-routing (client-side routes vallen terug op `index.html`, `/api/*` gaat naar de Function App).
