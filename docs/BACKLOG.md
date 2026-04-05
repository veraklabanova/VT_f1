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

---

## BL-009: UX/UI Redesign — Přístupnost (A11y)

**Datum:** 2026-04-04
**Priorita:** P1
**Stav:** Implementováno

### Popis změny

Kompletní redesign zaměřený na přístupnost pro cílovou skupinu (osoby s kognitivním postižením a jejich pečující).

**Typografie a témata:**
- Odstraněno patkové písmo z nadpisů, nahrazeno fontem Nunito (zaoblený, přátelský Sans-Serif)
- Při výběru role "Mám potíže s pamětí" se aktivuje třída `.a11y-theme` — zvětší font o 2–4px a zvýší kontrast

**Formulář (dotazník):**
- Radio buttony předělány na klikatelné bloky/karty — kliknutí kamkoliv na text/rámeček vybere odpověď
- Aktivní stav: 2px modrý rámeček + světle modré pozadí + tučný text
- Progress bar s vizuálním ukazatelem (Krok X z Y)
- Tlačítko Zpět zvětšeno na zřetelné tlačítko s obrysem

**Karty témat:**
- Deaktivované karty: opacity 0.4, odstraněna falešná tlačítka
- Obtížnost předělána na výrazný informační banner se zeleným podbarvením a ikonou

**Stažení a závěr:**
- Štítek "Zdarma" změněn na světle zelený textový tag (nekonkuruje CTA)
- Tlačítko "Stáhnout sešit" zvětšeno s ikonou
- Přidán fallback odkaz pro blokaci vyskakovacích oken
- Text u registrace přepsán na benefitní: "Vytvořit účet a odemknout další témata"

### Dopad na dokumentaci
- PAB: aktualizace sekce UI/UX, simplified mode, a11y-theme
- UAT: aktualizace vizuálních testů

---

## BL-010: UX/UI Redesign — Zateplení a emocionální design

**Datum:** 2026-04-04
**Priorita:** P1
**Stav:** Implementováno

### Popis změny

Odstranění sterilního "úřednického" dojmu. Vytvoření bezpečného, uklidňujícího prostředí.

**Barevná paleta:**
- Pozadí z #FFFFFF na teplou lomenou bílou (#FEFDFB)
- Hlavní texty z čisté černé na antracitovou (#2C2A29)
- Primární barva: šalvějová zelená (#5BA48A) pro tlačítka a ikony

**Měkká geometrie:**
- Karty: border-radius 16px
- Tlačítka: border-radius 999px (pilulky)

**Stíny:**
- Zrušeny tvrdé rámečky, nahrazeny jemným rozptýleným stínem
- box-shadow: 0 10px 25px rgba(0,0,0,0.05)

**Font:**
- Nunito (zaoblený, přátelský) z Google Fonts jako hlavní font

### Dopad na dokumentaci
- PAB: aktualizace vizuálního designu, barevné palety, typografie
- UAT: aktualizace vizuálních testů

---

## BL-011: UX Copywriting — Empatický tone of voice

**Datum:** 2026-04-04
**Priorita:** P0
**Stav:** Implementováno

### Popis změny

Kompletní přepis textů z klinického/hodnotícího tónu na roli "přátelského průvodce". Odstranění odborného žargonu, povzbuzení uživatele.

**Úvodní obrazovka:**
- H1: "Kognitivní trénink vlastním tempem" → "Trénujte paměť a myšlení. V klidu a vlastním tempem."
- Podnadpis přepsán na empatický tón bez termínu "kognitivní postižení"
- Kroky "Jak to funguje" přepsány na přátelský jazyk
- Karty: "Mám potíže s pamětí" → "Chci trénovat svou paměť", "Starám se o blízkého" → "Hledám sešit pro někoho blízkého"

**Dotazník:**
- Nadpis: "Krátký dotazník" → "Pojďme zjistit, co vám bude nejlépe vyhovovat"
- Podnadpis: uklidňující text ("Nemusíte se ničeho obávat...")
- Otázky přeformulovány jako běžný rozhovor, ne lékařský test
- Odpovědi zlidštěny

**Výběr tématu:**
- Nadpis: "Vyberte téma" → "O čem si chcete číst a přemýšlet?"
- Banner obtížnosti: "Určená obtížnost: Střední" → "Výborně, máme to! Podle vašich odpovědí..."

**Stažení a závěr:**
- Před stažením: "Váš sešit je připraven" → "Skvělé, váš sešit je připraven!"
- Tlačítko: "Stáhnout sešit zdarma" → "Stáhnout můj první sešit (zdarma)"
- Po stažení: "Sešit byl stažen!" → "Sešit se stahuje k vám do počítače."
- Registrace: "Vytvořit účet pro další sešity" → "Uložit výsledek a vytvořit bezplatný účet"

### Dopad na dokumentaci
- PAB: aktualizace textací UI, tone of voice
- UAT: aktualizace textových kontrol v testech

---

## BL-012: Oprava mapování severity → obtížnost cvičení (inverzní logika)

**Datum:** 2026-04-05
**Priorita:** P0 (kritická funkční chyba)
**Stav:** Implementováno

### Popis změny

**Původní stav (chybný):**
- Severity `lehka` (mírné postižení) → sešit s obtížností `lehka` (lehká cvičení)
- Severity `stredni` → sešit s obtížností `stredni`
- Severity `tezsi` (těžší postižení) → sešit s obtížností `tezsi` (těžší cvičení)

**Nový stav (správný):**
- Severity `lehka` (mírné postižení) → sešit s obtížností `tezsi` (náročnější cvičení — schopnější uživatel)
- Severity `stredni` → sešit s obtížností `stredni` (beze změny)
- Severity `tezsi` (těžší postižení) → sešit s obtížností `lehka` (jednodušší cvičení — potřeba adaptace)

### Dopad na dokumentaci
- PAB: aktualizace sekce "Assessment → Difficulty mapping"
- UAT: aktualizace testů závislých na mapování severity/difficulty

### Technická implementace
- Nová funkce `mapSeverityToDifficulty()` v `src/lib/assessment/evaluate.ts`
- Použita v onboarding stránce a API endpointu pro generování PDF
- Severity zůstává pojmenována dle míry postižení, obtížnost cvičení se mapuje inverzně

---

## BL-013: Vyladění AI promptů pro generování obrázků a cvičení

**Datum:** 2026-04-05
**Priorita:** P1
**Stav:** Implementováno

### Popis změny

**Problémy s obrázky:**
1. Obrázky jsou příliš složité, obsahují zbytečně mnoho prvků
2. Obsahují prvky nekonzistentní s textem cvičení (např. jiný počet osob, chybějící barvy)
3. Obrázky mají pouze ilustrační funkci — chybí cvičení, kde má obrázek funkční roli (např. „spoj obrázky podle čísel")

**Problémy s obtížností cvičení:**
- Těžká obtížnost: OK (beze změny)
- Střední obtížnost: potřeba o trochu zjednodušit
- Lehká obtížnost: potřeba výrazněji zjednodušit

### Dopad na dokumentaci
- PAB: aktualizace sekce AI prompty, typy cvičení

### Poznámka
Změny promptů budou předloženy ke schválení před implementací.

---

## BL-014: Admin revize — lightbox pro zvětšení obrázků

**Datum:** 2026-04-05
**Priorita:** P1
**Stav:** Implementováno

### Popis změny

**Původní stav:**
- Admin při revizi vidí obrázky cvičení pouze jako malý náhled (32×32 px / 128×128 px)
- Nelze obrázek zvětšit pro detailní posouzení kvality

**Nový stav:**
- Kliknutím na náhled obrázku se otevře lightbox s plnou velikostí
- Lightbox se zavře kliknutím mimo obrázek, na X tlačítko, nebo klávesou Escape
- Funguje v Revizi, Katalogu i Archivu

### Dopad na dokumentaci
- Žádný dopad na PAB — jedná se o UX vylepšení admin rozhraní

---

## BL-015: Sticky header v onboarding wizardu

**Datum:** 2026-04-05
**Priorita:** P2
**Stav:** Implementováno

### Popis změny

**Původní stav:**
- Header s logem a krokovým štítkem roluje spolu s obsahem stránky

**Nový stav:**
- Header i žlutý krokový štítek (Badge) zůstávají fixně nahoře při scrollování
- Progress bar pod headerem je také sticky

### Dopad na dokumentaci
- Žádný dopad na PAB

---

## BL-016: Oprava stahování sešitů pro organizace

**Datum:** 2026-04-05
**Priorita:** P0 (nefunkční flow)
**Stav:** Implementováno

### Popis změny

**Původní stav (chybný):**
- Organizace nemá vyplněnou `severity` (přeskakuje dotazník)
- Funkce `handleGenerate()` kontroluje `if (!selectedTheme || !severity) return` → vždy se ukončí
- Stahování po kliknutí na „Stáhnout můj první sešit (zdarma)" nefunguje
- Text tlačítka je zavádějící — organizace stahují 3 sešity, ne jeden

**Nový stav:**
- Pro organizace se generují 3 PDF (lehká, střední, těžší) bez závislosti na severity
- Text tlačítka pro organizace: „Stáhnout sešity ve třech obtížnostech (zdarma)"
- Kontrola `severity` se aplikuje pouze na individuální uživatele

### Dopad na dokumentaci
- PAB: aktualizace organizačního flow
- UAT: oprava testů pro organizační cestu

---

## BL-017: Rozlišení obtížnosti generovaných cvičení

**Datum:** 2026-04-05
**Priorita:** P1
**Stav:** Implementováno (součást BL-013)

### Popis změny

**Aktuální stav:**
- Popisy obtížností v promptu nedostatečně rozlišují úrovně
- Lehká a střední cvičení jsou si příliš podobná

**Požadované změny:**
- Těžší obtížnost (pro schopnější uživatele): beze změny
- Střední obtížnost: mírně zjednodušit zadání
- Lehká obtížnost (pro uživatele s těžším postižením): výrazně zjednodušit, kratší věty, méně kroků

### Dopad na dokumentaci
- PAB: aktualizace popisů obtížností

### Poznámka
Součást BL-013 — změny promptů budou předloženy ke schválení.

---

## BL-018: Landing Page Redesign — Varianta B (WCAG AAA)

**Datum:** 2026-04-05
**Priorita:** P0
**Stav:** Implementováno

### Popis změny

Kompletní redesign landing page podle finalizovaného Figma designu (Varianta B) a CSS design systému.

**Klíčové změny:**
- Nová barevná paleta: amber (#B5660A) pro CTA, sage (#2E6B2A) pro badges, terra (#B84535) pro akcentní karty
- WCAG 2.1 AAA kontrasty: min 7:1 pro text, 3:1 pro UI komponenty
- 4px amber section dividery mezi všemi sekcemi
- Karty s 2px viditelným borderem (#C4A882) + box-shadow
- Teplé pozadí: cream (#FDF6EE) a sand (#FFE4C0) pro střídající se sekce
- User-type karty s barevnými pozadími (amber-light, sage-light, terra-light) + emoji ikony
- Nová sekce: Feature strip (4 položky s amber left border + emoji)
- Nová sekce: Testimonial/citace s uvozovkami a amber side accents
- Nová sekce: CTA footer ("Připraveni začít?")
- Tmavý footer (#1A1208) s cream textem
- Section tag chip ("Jak to funguje") jako pill badge
- Odstraněny: Lucide ikony v kartách (nahrazeny emoji), gradienty, dekorativní blob prvky

**Figma reference:** `D4lWM0UmbRtX3U6BQNMQbV`, stránka "✅ Finální redesign"
**CSS spec:** `redesign_CSS.txt`

### Dopad na dokumentaci
- PAB: aktualizace vizuálního designu, barevné palety, struktury landing page
- CLAUDE.md: aktualizace seznamu design tokenů

### Technická implementace
- Nové CSS proměnné `--lp-*` v `src/app/globals.css` (prefixované, neovlivňují onboarding/dashboard)
- Kompletní přepis `src/app/page.tsx` s inline styles odkazujícími na `--lp-*` proměnné
- Font zachován: Nunito (BL-010)

---

## BL-019: PDF Layout Redesign — Varianta B

**Datum:** 2026-04-05
**Priorita:** P1
**Stav:** Implementováno

### Popis změny

Kompletní redesign PDF sešitu (titulní strana, stránky s úkoly, stránka s pokyny) podle finalizovaného Figma designu a specifikace `redesign_PDF.md`.

**Původní stav:**
- Bílé pozadí, font Roboto, minimální styling
- Žádné barevné akcenty, jednoduché hlavičky a patičky
- Cvičení bez prostoru pro odpovědi

**Nový stav:**

**Titulní strana:**
- Teplé krémové pozadí (#FDF6EE), headline "Trénujte paměť a myšlení. / V klidu a vlastním tempem."
- Image placeholder se sage halo (#C5E4C2) + bílou vnitřní plochou
- Topic card (#FFE4C0) s amber accent barem a názvem tématu (ExtraBold 40px)
- Info pills: "10 cvičení" (amber-light) + "X dovedností" (terra-light) — dynamický počet tagů
- Footer: sand pozadí, amber linka, difficulty badge (#2E6B2A, bílý text)

**Stránka s úkolem:**
- Hlavička: "Cvičení X / 10" + kognitivní tagy (oddělené tečkou)
- Topic chip: amber-light pill s emoji tématu
- Instrukční karta: bílá, 2px border (#8F6A40), sage accent bar (5px), text 14px / LH 165%
- Image placeholder: sage halo + vnitřní plocha (nebo skutečný obrázek)
- Karta "Moje odpovědi": sage accent bar, label + 5 řádků pro ruční zápis
- Footer: název tématu vlevo, číslo stránky vpravo (amber)

**Stránka s pokyny:**
- Stejný layout jako exercise page, bez image a "Moje odpovědi"
- Instrukční karta s textem pokynů pro pečující

**Společné prvky:**
- Font: Inter (400/600/700/800) z Google Fonts CDN s podporou české diakritiky
- Barevné tokeny z Varianta B design systému
- Karty s accent barem: zaoblené rohy (20px), sage/amber levý bar, border #8F6A40
- Footer: sand pozadí (#FFE4C0), amber horní linka (3px), zaoblené horní rohy (12px)
- Emoji mapování témat: Rodina→👨‍👩‍👧, Zahrada→🌻, Dům→🏠, Jaro→🌸, Domácí práce→🧹

**Figma reference:** `D4lWM0UmbRtX3U6BQNMQbV`, nodes `29:2` (titulní) a `35:2` (úkol)
**Spec:** `redesign_PDF.md`

### Dopad na dokumentaci
- PAB: aktualizace sekce PDF generování, vizuální popis sešitu
- CLAUDE.md: aktualizace klíčových souborů

### Technická implementace
- Kompletní přepis `src/lib/pdf/workbook-document.tsx`
- Font změněn z Roboto na Inter (4 váhy: 400, 600, 700, 800)
- Opacity barvy předpočítány (react-pdf nepodporuje CSS opacity na barvách)
- Accent bary jako absolutně pozicované `<View>` elementy (react-pdf nepodporuje ::before)
- `generate-workbook.ts` beze změn (pouze volá komponentu)
