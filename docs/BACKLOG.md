# Vlastním tempem — Backlog změn

Tento dokument eviduje změny oproti původní projektové dokumentaci (PAB_Vlastnim_tempem_v1.md).

---

## BL-001: Změna onboarding flow — registrace odložena za první sešit

**Datum:** 2026-04-04
**Priorita:** P0 (kritická UX změna)
**Stav:** Implementováno

### Popis změny

**Původní flow (PAB):**
1. Uživatel klikne "Začít" → přesměrován na `/register`
2. Registrace (email + heslo) → ověření emailu
3. Dashboard → dotazník → výběr tématu → generování sešitu
4. První sešit zdarma, další vyžaduje předplatné

**Nový flow:**
1. Uživatel klikne "Začít" → vstoupí do onboarding průvodce (bez registrace)
2. Krok 1: Výběr role (osoba s postižením / pečující / organizace)
3. Krok 2: Dotazník (7 otázek, varianta dle role) — přeskočen pro organizace
4. Krok 3: Výběr tématu
5. Krok 4: Generování a stažení prvního sešitu ZDARMA (bez registrace)
6. Registrace se vyžaduje při pokusu o vygenerování dalšího sešitu

### Dopad na dokumentaci

**Ovlivněné sekce PAB:**
- Kapitola "User Journey" — všechny 3 cesty (osoba, pečující, organizace)
- Invariant I5 ("User must have valid account to download workbook") — relaxován pro první sešit
- Předpoklad A1 ("Registration mandatory") — upraveno: registrace je povinná pro 2.+ sešit
- Freemium model — první sešit je přístupný bez registrace i bez účtu

**Ovlivněné UAT testy:**
- UAT-01 (Registrace) — registrace není první krok, ale následuje po prvním sešitu
- UAT-15 (Landing page) — landing vede na onboarding wizard, ne na registraci

### Technická implementace

- Nová stránka `/onboarding` s vícekrokovým průvodcem
- Data dotazníku a výběr tématu uloženy v `localStorage` (bez DB)
- První sešit generován přes API bez autentizace (speciální endpoint)
- Po stažení prvního sešitu nabídnuta registrace
- Při registraci se data z localStorage přenesou do DB (profil, dotazník)
- Landing page: tlačítka "Začít" vedou na `/onboarding?role=<role>`

### Rizika

- Zneužití (opakované generování bez registrace) — akceptováno pro MVP, řešitelné rate-limitingem
- Složitější implementace PDF generování bez autentizace
- Potřeba dočasného úložiště (localStorage) pro data před registrací

---

## BL-002: Archiv cvičení — nová admin sekce

**Datum:** 2026-04-04
**Priorita:** P1
**Stav:** Implementováno

### Popis změny

**Původní stav (PAB):**
- PAB definuje stav `archived` v životním cyklu cvičení (Generated → Awaiting Review → Approved / Rejected / Archived)
- Archivace je dostupná pouze z Katalogu (schválená cvičení)
- Neexistuje dedikovaná stránka pro prohlížení archivovaných cvičení
- Archivovat lze pouze z revizní fronty (Approve/Reject)

**Nový stav:**
- Nová admin stránka `/admin/archive` zobrazující všechna archivovaná cvičení
- Archivovat lze jak z Katalogu, tak z Revizní fronty
- Archivovaná cvičení lze obnovit zpět do fronty revize (tlačítko "Obnovit")
- Archiv zobrazuje datum archivace, téma, obtížnost, kognitivní značky a obrázek

### Dopad na dokumentaci

**Ovlivněné sekce PAB:**
- Admin rozhraní — rozšíření ze 6 na 7 funkčních oblastí (přidán Archiv)
- Stavový model cvičení — přidán přechod `Archived → Awaiting Review` (obnovení)

**Ovlivněné UAT testy:**
- UAT-11 (Admin Katalog) — archivace přesune cvičení do Archivu, ne jen "zmizí"
- Nový test: Admin může obnovit archivované cvičení zpět do revize

### Technická implementace

- Nová stránka `src/app/(admin)/admin/archive/page.tsx`
- API route rozšířena o akci `restore` (přechodový stav: archived → awaiting_review)
- Admin navigace rozšířena na 7 položek

---

## BL-003: Tlačítko Archivovat ve frontě revize

**Datum:** 2026-04-04
**Priorita:** P1
**Stav:** Implementováno

### Popis změny

**Původní stav (PAB):**
- Revizní fronta nabízí 2 akce: Schválit / Zamítnout

**Nový stav:**
- Revizní fronta nabízí 3 akce: Schválit / Archivovat / Zamítnout
- Admin může cvičení rovnou archivovat bez nutnosti ho nejdřív schválit a pak archivovat z Katalogu

### Dopad na dokumentaci

**Ovlivněné sekce PAB:**
- Kapitola "Review Queue" — rozšíření akcí o "Archivovat"

**Ovlivněné UAT testy:**
- UAT-10 (Admin Review Queue) — přidán test pro archivaci z fronty revize

---

## BL-004: Placeholder obrázky pro demo cvičení

**Datum:** 2026-04-04
**Priorita:** P2
**Stav:** Implementováno

### Popis změny

**Původní stav:**
- Demo/mock cvičení v admin rozhraní nemají grafickou část (image_url: null)

**Nový stav:**
- Cvičení, která pracují s vizuálním obsahem (najděte rozdíly, popište obrázek), zobrazují placeholder obrázek (šedý box s ikonou)
- Placeholder se zobrazuje v Revizi, Katalogu i Archivu
- Reálné obrázky (z DALL-E 3) budou fungovat identicky — placeholder se zobrazí jen při `image_url === 'placeholder'`

### Dopad na dokumentaci

- Žádný dopad na PAB — jedná se o implementační detail demo módu
- Po napojení na Supabase + DALL-E 3 budou placeholder obrázky nahrazeny reálnými

---

## BL-005: Admin demo mód bez autentizace

**Datum:** 2026-04-04
**Priorita:** P2
**Stav:** Implementováno

### Popis změny

**Původní stav (PAB):**
- Admin rozhraní je přístupné pouze přihlášenému uživateli s rolí `admin`

**Nový stav:**
- Pokud není dostupné připojení k Supabase (placeholder klíče, výpadek), admin stránky přejdou do demo módu
- Demo mód zobrazuje žlutý banner "Demo mód — admin rozhraní bez připojení k databázi. Data jsou ukázková."
- Všechny admin stránky používají mock data jako fallback
- Demo akce (schválení, zamítnutí, archivace, obnovení) fungují lokálně bez DB

### Dopad na dokumentaci

- Žádný dopad na PAB — demo mód je vývojový nástroj, v produkci se neprojeví
- Middleware upraveno tak, aby admin cesty propouštěl i bez auth (layout řeší fallback)

### Riziko

- V produkci je nutné mít platné Supabase klíče — demo mód je pouze pro vývoj/testování

---

## BL-006: Dva nezávislé registrační flow + přenos dat z onboardingu

**Datum:** 2026-04-04
**Priorita:** P0 (kritická UX změna)
**Stav:** Implementováno

### Popis změny

**Původní stav (BL-001):**
- Jediná cesta k registraci vede přes onboarding wizard (role → dotazník → téma → stažení → registrace)
- Přímá registrace přes tlačítko "Přihlásit se" na landing page vede na login, odkud "Zaregistrujte se" vede zpět na landing page
- Po registraci přes onboarding se data z dotazníku nepřenesou do profilu — uživatel vidí "Vyplňte dotazník" znovu

**Nový stav — dva paralelní flow:**

**Flow A: Přímá registrace (tlačítko "Přihlásit se" → "Zaregistrujte se")**
- Login stránka: odkaz "Zaregistrujte se" vede na `/register` (ne zpět na landing)
- Na `/register` uživatel vybere roli a vyplní registrační formulář
- Po registraci → dashboard → dotazník → téma → sešit (standardní flow)

**Flow B: Onboarding first (tlačítka "Začít" na landing page)**
- Uživatel projde onboarding wizard bez registrace (role → dotazník → téma → stažení)
- Data se ukládají do `localStorage`
- Po stažení prvního sešitu je nabídnuta registrace
- Při registraci se data z localStorage (role, odpovědi dotazníku, severity) automaticky přenesou do profilu v DB
- Uživatel po přihlášení vidí dashboard s již vyplněnou úrovní obtížnosti

### Dopad na dokumentaci

**Ovlivněné sekce PAB:**
- User Journey — existují 2 paralelní vstupní body (přímá registrace vs. onboarding first)
- Registrační stránka — musí podporovat výběr role bez URL parametru

**Ovlivněné UAT testy:**
- UAT-01 (Registrace) — testovat oba flow
- Nový test: po onboarding registraci je severity level již vyplněn

### Technická implementace

- Registrační stránka `/register` — přidán výběr role pokud není v URL parametru
- Login stránka — odkaz "Zaregistrujte se" vede na `/register`
- Registrační stránka — po úspěšné registraci čte `localStorage` klíč `vt_onboarding` a přenáší assessment data do DB
- Onboarding wizard — ukládá kompletní data (role, answers, severity) do `localStorage`
- Auth callback — po ověření emailu přenese data z localStorage do profilu

---

## BL-007: Admin — chybí možnost odhlášení

**Datum:** 2026-04-04
**Priorita:** P1
**Stav:** Implementováno

### Popis

V admin rozhraní chybí tlačítko pro odhlášení. Uživatel musí nejdřív kliknout "Zpět" do uživatelské části a tam se odhlásit. Admin layout by měl mít vlastní odhlašovací tlačítko v navigaci.

### Dopad na dokumentaci

- Žádný dopad na PAB — jedná se o chybějící UX prvek

---

## BL-008: Onboarding výběr témat — zobrazovat jen dostupná témata

**Datum:** 2026-04-04
**Priorita:** P1
**Stav:** Implementováno

### Popis

**Aktuální stav:**
- Onboarding wizard zobrazuje všech 5 témat (Rodina, Zahrada, Dům, Jaro, Domácí práce) bez ohledu na to, zda k nim existují schválená cvičení
- Uživatel může vybrat téma, pro které není dostatek cvičení → generování sešitu selže

**Požadovaný stav:**
- Témata s dostatkem dat (splňující I8) by měla být graficky zvýrazněna a klikatelná
- Témata bez dat by měla mít vysvětlující štítek (např. "Připravujeme") a být vizuálně odlišena (šedá, neklikatelná nebo s upozorněním)
- V onboarding wizardu se toto řeší pomocí mock témat — je potřeba napojit na reálné API `/api/themes/available`

### Dopad na dokumentaci

**Ovlivněné sekce PAB:**
- Invariant I8 — kontrola dostupnosti tématu se musí promítnout i do onboarding wizardu, nejen do dashboard stránky témat

### Poznámka

Dashboard stránka `/themes` již správně filtruje témata dle I8. Problém je pouze v onboarding wizardu, který používá hardcoded mock témata.
