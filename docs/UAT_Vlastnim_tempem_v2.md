# UAT — Vlastním tempem (MVP)

**Projekt:** Vlastním tempem
**Organizace:** At Your Own Pace, z.s.
**Verze dokumentu:** v2.0
**Datum:** 2026-04-04
**Vstupní dokumenty:** PAB_Vlastnim_tempem_v1.md (PAB v1), BACKLOG.md (BL-001 až BL-008)
**Doména:** HealthTech / SocialTech — kognitivní rehabilitace, neziskový sektor
**Formát testů:** Klasický (Krok — Akce — Očekávaný výsledek)

> **Změny oproti v1:** Testy aktualizovány dle backlogu BL-001 až BL-008.
> Nové a změněné testy jsou označeny **[NOVÉ v2]** resp. **[ZMĚNA v2]**.

---

## 1. Uživatelské testy (UAT)

---

### Modul 1 — Registrace a ověření emailu

#### TC-1.01: Registrace jednotlivce — Flow A: Přímá registrace, role Pečující osoba (High) [ZMĚNA v2]

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Otevřete landing page | Zobrazí se 3 karty: Osoba s postižením / Pečující / Organizace. V hlavičce je tlačítko „Přihlásit se" |
| 2 | Klikněte na „Přihlásit se" v hlavičce | Otevře se přihlašovací stránka |
| 3 | Klikněte na odkaz „Zaregistrujte se" | Otevře se registrační stránka `/register` (ne zpět na landing page) |
| 4 | Na registrační stránce vyberte roli „Pečující osoba" | Zobrazí se registrační formulář pro pečující osobu |
| 5 | Vyplňte email, heslo a potvrďte heslo | Pole přijmou vstup |
| 6 | Odešlete formulář | Systém vytvoří účet typu „jednotlivec" s rolí „pečující". Zobrazí se informace o odeslání ověřovacího emailu |
| 7 | Zkontrolujte emailovou schránku | Doručen ověřovací email s odkazem |
| 8 | Klikněte na ověřovací odkaz | Email ověřen, účet aktivován, systém potvrdí úspěšné ověření |
| 9 | Přihlaste se a zkontrolujte dashboard | Dashboard zobrazí výzvu k vyplnění formuláře míry postižení (žádná data z onboardingu nejsou předvyplněna) |

#### TC-1.02: Registrace jednotlivce — Flow A: Přímá registrace, role Osoba s postižením (High) [ZMĚNA v2]

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Na landing page klikněte na „Přihlásit se" → „Zaregistrujte se" | Otevře se registrační stránka `/register` |
| 2 | Vyberte roli „Osoba s postižením" | Formulář se přepne do zjednodušeného režimu |
| 3 | Vyplňte email a heslo | Formulář je zobrazen s většími fonty, méně barvami a většími klikacími plochami (min. 48×48 px) |
| 4 | Odešlete formulář | Systém vytvoří účet typu „jednotlivec" s rolí „osoba_s_postižením". Odeslán ověřovací email |
| 5 | Ověřte email kliknutím na odkaz | Email ověřen, účet aktivován |

#### TC-1.03: Registrace jednotlivce — Flow B: Onboarding first, role Pečující (High) [NOVÉ v2]

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Na landing page klikněte na kartu „Starám se o blízkého" (tlačítko „Začít") | Spustí se onboarding průvodce na `/onboarding?role=pecujici` (bez registrace) |
| 2 | Projděte kroky onboardingu: dotazník → výběr tématu → stažení sešitu | První sešit se vygeneruje a stáhne ZDARMA bez registrace |
| 3 | Po stažení sešitu klikněte na nabídku registrace | Otevře se registrační formulář s předvyplněnou rolí „pečující" |
| 4 | Vyplňte email a heslo, odešlete formulář | Systém vytvoří účet. Odeslán ověřovací email |
| 5 | Ověřte email a přihlaste se | Dashboard zobrazí již vyplněnou úroveň obtížnosti (severity level) z onboardingu — data z localStorage byla přenesena do DB |

#### TC-1.04: Registrace organizace — Flow A: Přímá registrace (High) [ZMĚNA v2]

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Na landing page klikněte na „Přihlásit se" → „Zaregistrujte se" | Otevře se registrační stránka `/register` |
| 2 | Vyberte roli „Organizace" | Zobrazí se registrační formulář pro organizaci |
| 3 | Vyplňte email, heslo, název organizace a kontakt | Všechna povinná pole jsou k dispozici |
| 4 | Odešlete formulář | Systém vytvoří účet typu „organizace". Odeslán ověřovací email |
| 5 | Ověřte email | Účet aktivován |

#### TC-1.05: Registrace — duplicitní email (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Na registrační stránce zadejte email, který je již registrován | Pole přijme vstup |
| 2 | Odešlete formulář | Systém zobrazí chybovou hlášku o duplicitním emailu. Účet nevznikne |

#### TC-1.06: Registrace — nevalidní vstupní data (Medium)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Zadejte nevalidní formát emailu (např. „abc@") | Systém zobrazí validační chybu |
| 2 | Zadejte příliš slabé heslo | Systém zobrazí požadavky na sílu hesla |
| 3 | Ponechte povinné pole prázdné (u organizace: název nebo kontakt) | Systém neumožní odeslání formuláře, zobrazí upozornění na chybějící povinná pole |

#### TC-1.07: Přihlášení bez ověřeného emailu (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Zaregistrujte nový účet, NEklikejte na ověřovací odkaz | Účet existuje, email neověřen |
| 2 | Pokuste se přihlásit s platnými přihlašovacími údaji | Systém odmítne přihlášení a zobrazí hlášku o nutnosti ověřit email |

#### TC-1.08: Přenos dat z onboardingu při registraci (High) [NOVÉ v2]

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Projděte onboarding průvodce (role pečující, vyplňte dotazník, vyberte téma, stáhněte sešit) | Data uložena v localStorage (role, odpovědi, severity) |
| 2 | Klikněte na nabídku registrace po stažení sešitu | Registrační formulář se otevře s předvyplněnou rolí |
| 3 | Dokončete registraci a ověření emailu | Účet vytvořen |
| 4 | Přihlaste se a zkontrolujte dashboard | Míra postižení je již vyplněna v profilu (severity level z dotazníku). Uživatel NEVIDÍ výzvu „Vyplňte dotazník" — data byla přenesena z localStorage do DB |

---

### Modul 2 — Přihlášení a automatický režim

#### TC-2.01: Přihlášení pečující osoby (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Na přihlašovací stránce zadejte email a heslo pečující osoby | Pole přijmou vstup |
| 2 | Odešlete formulář | Systém přihlásí uživatele. Dashboard se zobrazí ve standardním režimu s výzvou k vyplnění formuláře míry postižení |

#### TC-2.02: Přihlášení osoby s postižením — automatický zjednodušený režim (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Přihlaste se s účtem role „osoba_s_postižením" | Systém přihlásí uživatele |
| 2 | Zkontrolujte zobrazení dashboardu | Dashboard se automaticky zobrazí ve zjednodušeném režimu (CSS třída `simplified-mode`): větší fonty, méně barev, větší klikací plochy, velké karty, minimální prvky |

#### TC-2.03: Přihlášení organizace (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Přihlaste se s účtem typu „organizace" | Systém přihlásí uživatele |
| 2 | Zkontrolujte dashboard | Zobrazí se standardní dashboard s profilem organizace, výběrem témat a historií sešitů. Formulář míry postižení se NEZOBRAZÍ (I7) |

#### TC-2.04: Přihlášení — nesprávné přihlašovací údaje (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Zadejte neexistující email nebo špatné heslo | Pole přijmou vstup |
| 2 | Odešlete formulář | Systém odmítne přihlášení. Zobrazí se obecná chybová hláška (bez specifikace, zda je špatný email nebo heslo) |

---

### Modul 3 — Formulář míry postižení

#### TC-3.01: Vyplnění formuláře — role Pečující (varianta B, 3. osoba) (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Na dashboardu pečující osoby klikněte na výzvu k vyplnění formuláře | Otevře se formulář ve variantě B (znění ve 3. osobě) |
| 2 | Ověřte úvodní text | Zobrazí se: „Pokud je to možné, vyplňte tento formulář společně s blízkou osobou nebo pečovatelem…" |
| 3 | Zodpovězte všech 7 otázek (5 dimenzí: paměť, orientace, pozornost, jazyk, samostatnost) | Každá otázka nabízí 3 odpovědi na škále 1–3 |
| 4 | Odešlete formulář | Systém vyhodnotí průměr odpovědí, přiřadí míru postižení (lehká/střední/těžší) a uloží do profilu uživatele |

#### TC-3.02: Vyplnění formuláře — role Osoba s postižením (varianta A, 1. osoba) (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Na dashboardu osoby s postižením klikněte na výzvu k formuláři | Otevře se formulář ve variantě A (znění v 1. osobě), ve zjednodušeném vizuálním režimu |
| 2 | Ověřte úvodní text | Zobrazí se: „Je dobré vyplnit to s někým blízkým." |
| 3 | Zodpovězte všech 7 otázek | Znění otázek je v 1. osobě, vizuální styl zjednodušený |
| 4 | Odešlete formulář | Průměr vyhodnocen, míra postižení uložena v profilu |

#### TC-3.03: Vyhodnocení míry postižení — prahové hodnoty (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Vyplňte formulář tak, aby průměr 7 odpovědí byl v rozsahu 1.0–1.6 | Systém přiřadí míru „Lehká" |
| 2 | Vyplňte formulář s průměrem 1.7–2.3 | Systém přiřadí míru „Střední" |
| 3 | Vyplňte formulář s průměrem 2.4–3.0 | Systém přiřadí míru „Těžší" |

#### TC-3.04: Formulář — hranice prahových hodnot (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Vyplňte formulář s přesným průměrem 1.6 | Systém přiřadí míru „Lehká" |
| 2 | Vyplňte formulář s přesným průměrem 1.7 | Systém přiřadí míru „Střední" |
| 3 | Vyplňte formulář s přesným průměrem 2.3 | Systém přiřadí míru „Střední" |
| 4 | Vyplňte formulář s přesným průměrem 2.4 | Systém přiřadí míru „Těžší" |

#### TC-3.05: Formulář — neúplné odpovědi (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Otevřete formulář a zodpovězte pouze 5 ze 7 otázek | Dvě otázky zůstanou nezodpovězeny |
| 2 | Pokuste se odeslat formulář | Systém neumožní odeslání, zobrazí upozornění na nezodpovězené otázky (I11) |

#### TC-3.06: Editace formuláře (Medium)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Po vyplnění formuláře přejděte na dashboard | Zobrazí se tlačítko „Upravit" u míry postižení |
| 2 | Klikněte na „Upravit" | Formulář se otevře s předvyplněnými odpověďmi z posledního vyplnění |
| 3 | Změňte některé odpovědi a odešlete | Systém přepočítá průměr, aktualizuje míru postižení v profilu. Zobrazí upozornění o aktualizaci. Poslední stav přepisuje předchozí (A13) |

#### TC-3.07: Formulář pokrývá všech 5 dimenzí (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Otevřete formulář (obě varianty) | Formulář obsahuje otázky pokrývající: Paměť (Q1, Q2), Orientace (Q3), Pozornost (Q4, Q5), Jazyk (Q6), Samostatnost (Q7) — celkem 7 otázek, 5 dimenzí (I11) |

---

### Modul 4 — Výběr tématu a generování sešitu (jednotlivec)

#### TC-4.01: Výběr tématu a stažení prvního sešitu zdarma (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Po vyplnění formuláře přejděte na výběr tématu | Zobrazí se dostupná témata. Nedostupná témata (nesplňující I8) nejsou nabízena |
| 2 | Vyberte dostupné téma | Systém zahájí generování sešitu |
| 3 | Počkejte na dokončení generování | Systém sestaví PDF sešit: 12 stran (titulní + 10 úkolů + instrukce), formát A4, UTF-8 |
| 4 | Stáhněte sešit | Sešit se stáhne zdarma (freemium — první sešit). Sešit se uloží do historie |

#### TC-4.02: Struktura PDF sešitu (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Otevřete stažený PDF sešit | Sešit má přesně 12 stran (D40) |
| 2 | Zkontrolujte stranu 1 | Titulní strana: obrázek k tématu, „Vlastním tempem — Pracovní sešit", název tématu, míra obtížnosti |
| 3 | Zkontrolujte strany 2–11 | Každá strana = jeden úkol (textová + grafická část). Celkem 10 úkolů (I9) |
| 4 | Zkontrolujte stranu 12 | Instrukce pro pečující: jak sešit používat, doporučený postup, kontakt na organizaci |

#### TC-4.03: Diverzita kognitivních tagů v sešitu (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Vygenerujte sešit a zkontrolujte metadata úkolů | Sešit obsahuje úkoly s minimálně 4 různými kognitivními tagy (I4) |

#### TC-4.04: Sešit obsahuje pouze schválené úkoly (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Vygenerujte sešit | Všech 10 úkolů v sešitu má stav „Schválený" (I1) |

#### TC-4.05: Pokus o generování bez vyplněného formuláře (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Přihlaste se jako jednotlivec bez vyplněného formuláře | Dashboard nezobrazuje možnost výběru tématu / nabízí výzvu k vyplnění formuláře |
| 2 | Pokuste se přistoupit k výběru tématu (pokud je to technicky možné) | Systém odmítne generování — míra postižení musí být vyhodnocena před sestavením sešitu (I2) |

#### TC-4.06: Druhý sešit — vyžadováno předplatné (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Po stažení prvního sešitu zdarma vyberte další téma | Systém zjistí, že první sešit již byl využit |
| 2 | Pokuste se vygenerovat sešit | Systém zobrazí výzvu k aktivaci předplatného (I6). Bez aktivního předplatného nelze stáhnout |

#### TC-4.07: Nedostupné téma — nedostatek úkolů (Medium)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Přejděte na výběr tématu | Témata, která nemají min. 10 schválených úkolů s min. 4 různými kognitivními tagy pro příslušnou obtížnost, nejsou zobrazena jako dostupná (I8) |

---

### Modul 5 — Výběr tématu a generování sešitů (organizace)

#### TC-5.01: Organizace — výběr tématu a stažení první sady zdarma (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Přihlaste se jako organizace | Dashboard zobrazí výběr témat (bez formuláře míry postižení — I7) |
| 2 | Vyberte dostupné téma | Systém zahájí generování 3 sešitů (lehká/střední/těžší) |
| 3 | Počkejte na dokončení | Vygenerovány 3 PDF sešity, každý 12 stran |
| 4 | Stáhněte sešity | Nabídnuto stažení jednotlivých PDF (3 tlačítka per míra) i ZIP archivu. První sada zdarma |

#### TC-5.02: Organizace — 3 sešity per téma (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Zkontrolujte vygenerované sešity | Každý sešit odpovídá jedné míře obtížnosti (lehká, střední, těžší). Každý obsahuje 10 úkolů odpovídající obtížnosti (I9, D12) |

#### TC-5.03: Organizace — druhá sada vyžaduje předplatné (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Po stažení první sady zdarma vyberte další téma | Systém zobrazí výzvu k aktivaci předplatného (I6) |

#### TC-5.04: Organizace — nedostatek úkolů pro všechny stupně (Medium)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Přejděte na výběr tématu | Téma je dostupné pouze pokud splňuje I8 pro všechny 3 stupně obtížnosti. Pokud jakýkoli stupeň nemá dostatek úkolů, téma není dostupné |

---

### Modul 6 — Předplatné a Stripe

#### TC-6.01: Aktivace předplatného — individuální tarif (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Po výzvě k předplatnému vyberte individuální tarif | Zobrazí se Stripe checkout (testovací režim) |
| 2 | Zadejte testovací platební údaje a potvrďte | Platba úspěšná. Předplatné aktivováno (stav: aktivní). Systém umožní generování dalších sešitů |

#### TC-6.02: Aktivace předplatného — institucionální tarif (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Přihlaste se jako organizace, vyberte institucionální tarif | Zobrazí se Stripe checkout |
| 2 | Dokončete platbu | Předplatné aktivováno |

#### TC-6.03: Zamítnutá platba (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Při Stripe checkoutu zadejte nevalidní platební údaje | Stripe zamítne platbu |
| 2 | Zkontrolujte stav | Předplatné NENÍ aktivováno. Systém zobrazí chybovou hlášku. Uživatel může zkusit znovu |

#### TC-6.04: Zrušení předplatného — self-service (Medium)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | V nastavení účtu klikněte na „Zrušit předplatné" | Systém zobrazí potvrzovací dialog |
| 2 | Potvrďte zrušení | Předplatné zůstává aktivní do konce aktuálního fakturačního období. Po jeho uplynutí přejde do stavu „neaktivní" (D16) |

#### TC-6.05: Stažení po expiraci předplatného (Medium)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Přihlaste se s účtem s expirovaným předplatným | Přihlášení úspěšné |
| 2 | Přejděte do historie sešitů | Dříve vygenerované sešity jsou dostupné ke stažení (D17) |
| 3 | Pokuste se vygenerovat nový sešit | Systém zobrazí výzvu k obnovení předplatného |

---

### Modul 7 — Historie sešitů

#### TC-7.01: Historie sešitů — jednotlivec (Medium)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Po stažení sešitu přejděte na dashboard | V sekci „Moje sešity" / historie se zobrazí vygenerovaný sešit |
| 2 | Klikněte na stažení | Sešit se opakovaně stáhne (UC11) |

#### TC-7.02: Historie sešitů — organizace (Medium)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Na dashboardu organizace přejděte do historie | Zobrazí se seznam sad sešitů s 3 tlačítky per míra + ZIP (UC11) |
| 2 | Stáhněte jednotlivý sešit i ZIP | Obojí funguje korektně |

#### TC-7.03: Neměnnost sešitu po vygenerování (Medium)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Stáhněte sešit, zapamatujte si obsah | Sešit stažen |
| 2 | Požádejte admina o archivaci jednoho z úkolů obsažených v sešitu | Úkol archivován |
| 3 | Znovu stáhněte stejný sešit z historie | Obsah sešitu je identický — sešit je snapshot, archivace úkolu neovlivňuje existující sešity (A14, D1) |

---

### Modul 8 — Zjednodušený režim UI

#### TC-8.01: Automatická aktivace zjednodušeného režimu (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Přihlaste se jako „osoba_s_postižením" | Systém automaticky aktivuje CSS třídu `simplified-mode` |
| 2 | Zkontrolujte vizuální styl | Větší fonty, méně barev, větší klikací plochy (min. 48×48 px), velké karty, minimální prvky |

#### TC-8.02: Standardní režim pro pečující a organizaci (Medium)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Přihlaste se jako „pečující" | Dashboard ve standardním režimu |
| 2 | Přihlaste se jako „organizace" | Dashboard ve standardním režimu |

#### TC-8.03: Zjednodušený režim — formulář (Medium)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Jako osoba s postižením otevřete formulář míry postižení | Formulář je zobrazen ve zjednodušeném vizuálním režimu se zněním v 1. osobě |

---

### Modul 9 — Admin: Dávkové generování úkolů

#### TC-9.01: Zadání parametrů a spuštění dávky (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Přihlaste se jako admin | Admin dashboard se zobrazí (matice, statistiky, rychlé akce) |
| 2 | Přejděte do sekce „Generování úkolů" | Zobrazí se formulář: téma, obtížnost, kognitivní funkce, počet, prompt |
| 3 | Vyplňte parametry (téma: Rodina, obtížnost: lehká, kognitivní funkce: paměť, počet: 10) | Pole přijmou vstup |
| 4 | Zkontrolujte a případně upravte AI prompt | Admin vidí prompt a může ho editovat před odesláním (D41) |
| 5 | Spusťte generování | Systém dávkově zavolá Claude API (text) + DALL-E 3 (grafika). Úkoly se vytvoří ve stavu „Ke schválení" |

#### TC-9.02: Kulturní kontext v DALL-E promptu (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Při generování zkontrolujte prompt pro DALL-E 3 | Prompt obsahuje kulturní kontext: „Central European setting", „Czech traditional [topic]" (D42) |

#### TC-9.03: Částečné selhání AI generování (Medium)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Spusťte dávku generování (simulujte částečné selhání) | Úspěšně vygenerované úkoly se uloží (A19). Selhání se zalogují do error logu |
| 2 | Přejděte do error logu | Selhané položky jsou viditelné s možností retry |

#### TC-9.04: Validace parametrů generování (Medium)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Zadejte počet úkolů = 0 nebo záporné číslo | Systém odmítne spuštění, zobrazí validační chybu |
| 2 | Vynechte povinný parametr (téma nebo obtížnost) | Systém neumožní spuštění |

---

### Modul 10 — Admin: Fronta ke schválení

#### TC-10.01: Schválení úkolu (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Přejděte do „Fronta ke schválení" | Zobrazí se seznam úkolů ve stavu „Ke schválení" s náhledem textu i grafiky |
| 2 | Použijte filtry (téma, obtížnost) | Filtrování funguje korektně |
| 3 | Otevřete náhled úkolu | Zobrazen text + grafika (PNG 1024×1024) |
| 4 | Klikněte na „Schválit" | Stav úkolu se změní na „Schválený". Úkol je dostupný pro sestavení sešitů (I1) |

#### TC-10.02: Zamítnutí úkolu (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Ve frontě ke schválení otevřete úkol | Náhled zobrazen |
| 2 | Klikněte na „Zamítnout" | Stav úkolu se změní na „Zamítnutý". Úkol NENÍ dostupný pro sešity |

#### TC-10.03: Archivace úkolu z fronty revize (High) [NOVÉ v2]

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Ve frontě ke schválení otevřete úkol ve stavu „Ke schválení" | Náhled zobrazen. Zobrazí se 3 akční tlačítka: Schválit / Archivovat / Zamítnout |
| 2 | Klikněte na „Archivovat" | Stav úkolu se změní na „Archivovaný". Úkol je přesunut do Archivu. Úkol NENÍ dostupný pro sešity |
| 3 | Přejděte do sekce „Archiv" | Archivovaný úkol je zobrazen v seznamu archivovaných úkolů |

#### TC-10.04: Schválení úkolu v nesprávném stavu (Medium)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Pokuste se schválit úkol, který není ve stavu „Ke schválení" | Systém odmítne akci, zobrazí chybovou hlášku |

---

### Modul 11 — Admin: Katalog

#### TC-11.01: Prohlížení a filtrování Katalogu (Medium)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Přejděte do sekce „Katalog" | Zobrazí se seznam schválených úkolů |
| 2 | Filtrujte dle tématu, obtížnosti, kognitivního tagu | Výsledky odpovídají filtrům |

#### TC-11.02: Archivace úkolu z Katalogu (Medium) [ZMĚNA v2]

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | V Katalogu vyberte schválený úkol | Náhled zobrazen |
| 2 | Klikněte na „Archivovat" | Stav úkolu se změní na „Archivovaný". Úkol se přesune do sekce Archiv. Úkol již není dostupný pro nové sešity. Existující sešity nejsou ovlivněny |

#### TC-11.03: Archivace úkolu v nesprávném stavu (Low)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Pokuste se archivovat úkol ve stavu „Ke schválení" nebo „Zamítnutý" | Systém odmítne akci — archivovat z katalogu lze pouze schválené úkoly |

---

### Modul 12 — Admin: Dashboard, Přehled témat, Error log

#### TC-12.01: Admin Dashboard — matice téma × obtížnost (Medium)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Přejděte na admin dashboard | Zobrazí se matice téma × obtížnost se statistikami počtu schválených úkolů |
| 2 | Zkontrolujte indikaci dostatku/nedostatku | Buňky, které nesplňují I8 (min. 10 úkolů + min. 4 různé kognitivní tagy), jsou vizuálně odlišeny |

#### TC-12.02: Přehled témat — naplněnost a dostupnost (Medium)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Přejděte do „Přehled témat" | Zobrazí se seznam témat s naplněností per obtížnost |
| 2 | Zkontrolujte dostupnost na frontendu | Témata splňující I8 pro všechny potřebné obtížnosti jsou označena jako dostupná (P2 — automatická dostupnost) |

#### TC-12.03: Error log — zobrazení a retry (Medium)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Po částečně neúspěšném generování přejděte do „Error log" | Zobrazí se záznamy o selhání AI generování |
| 2 | Klikněte na retry u selhané položky | Systém se pokusí o opětovné generování |

#### TC-12.04: Admin Dashboard — nezobrazuje dotazník pro admin roli (Medium) [NOVÉ v2]

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Přihlaste se jako admin | Admin dashboard se zobrazí |
| 2 | Zkontrolujte obsah dashboardu | Dashboard NEOBSAHUJE kartu/sekci dotazníku (assessment). Dotazník se zobrazuje pouze uživatelským rolím (osoba_s_postižením, pečující), nikoli admin roli |

---

### Modul 13 — Úkoly a metadata

#### TC-13.01: Každý úkol má povinná metadata (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Po vygenerování úkolů zkontrolujte jejich atributy | Každý úkol má: textovou část, grafickou část (PNG 1024×1024), téma, obtížnost (3 stupně), alespoň jeden kognitivní tag, stav, datum generování, ID dávky (I3, I10) |

#### TC-13.02: Stavový model úkolu (High) [ZMĚNA v2]

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Vygenerujte dávku úkolů | Úkoly ve stavu „Vygenerovaný" → automaticky „Ke schválení" |
| 2 | Schvalte úkol | Stav → „Schválený" |
| 3 | Archivujte schválený úkol | Stav → „Archivovaný" |
| 4 | Obnovte archivovaný úkol | Stav → „Ke schválení" (nový přechod dle BL-002) |
| 5 | Ověřte, že zamítnutý úkol nelze schválit ani archivovat | Stav „Zamítnutý" je konečný |

---

### Modul 14 — Sestavení sešitu — algoritmika

#### TC-14.01: Round-robin přes kognitivní tagy (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Vygenerujte sešit pro téma s dostatkem úkolů | Algoritmus vybírá úkoly metodou round-robin přes kognitivní tagy, zajišťuje min. 4 různé tagy (I4, D19) |

#### TC-14.02: Náhodnost výběru — různé sešity (Medium)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Vygenerujte dva sešity pro stejné téma a obtížnost | Sešity obsahují odlišnou sestavu úkolů (seed per request — C1) |

#### TC-14.03: Filtr: téma + obtížnost (High)

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Vygenerujte sešit pro konkrétní téma a míru | Všech 10 úkolů odpovídá zvolenému tématu a přiřazené obtížnosti |

---

### Modul 15 — Landing page

#### TC-15.01: Landing page — vstupní cesty (High) [ZMĚNA v2]

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Otevřete landing page | Zobrazí se 3 karty: „Mám potíže s pamětí" (osoba s postižením), „Starám se o blízkého" (pečující), „Jsme organizace" (organizace). V hlavičce je tlačítko „Přihlásit se" |
| 2 | Klikněte na kartu „Mám potíže s pamětí" (tlačítko „Začít") | Spustí se onboarding průvodce na `/onboarding?role=osoba_s_postizenim` (NEvede na registraci) |
| 3 | Klikněte na kartu „Starám se o blízkého" (tlačítko „Začít") | Spustí se onboarding průvodce na `/onboarding?role=pecujici` |
| 4 | Klikněte na kartu „Jsme organizace" (tlačítko „Začít") | Spustí se onboarding průvodce na `/onboarding?role=organizace` |
| 5 | Klikněte na „Přihlásit se" v hlavičce | Otevře se přihlašovací stránka `/login` |
| 6 | Na přihlašovací stránce klikněte na „Zaregistrujte se" | Otevře se registrační stránka `/register` (přímá registrace — Flow A) |

---

### Modul 16 — Onboarding průvodce (bez registrace) [NOVÉ v2]

#### TC-16.01: Onboarding — kompletní flow pro pečující (High) [NOVÉ v2]

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Na landing page klikněte na kartu „Starám se o blízkého" | Spustí se onboarding průvodce. Krok 1: Výběr role (předvyplněna role „pečující") |
| 2 | Potvrďte roli a přejděte na krok 2 | Zobrazí se dotazník ve variantě B (3. osoba), 7 otázek |
| 3 | Zodpovězte všech 7 otázek | Každá otázka nabízí 3 odpovědi na škále 1–3 |
| 4 | Odešlete dotazník a přejděte na krok 3 | Zobrazí se výběr tématu. Dostupná témata mají zelený rámeček a tlačítko „Vybrat". Nedostupná témata mají štítek „Připravujeme" a NEJSOU klikatelná |
| 5 | Vyberte dostupné téma | Systém zahájí generování sešitu |
| 6 | Počkejte na dokončení generování | Krok 4: Zobrazí se tlačítko pro stažení PDF sešitu |
| 7 | Stáhněte sešit | Sešit se stáhne ZDARMA bez registrace. Po stažení se zobrazí nabídka registrace |

#### TC-16.02: Onboarding — kompletní flow pro osobu s postižením (High) [NOVÉ v2]

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Na landing page klikněte na kartu „Mám potíže s pamětí" | Spustí se onboarding průvodce. Krok 1: Výběr role (předvyplněna role „osoba_s_postižením") |
| 2 | Potvrďte roli a přejděte na krok 2 | Zobrazí se dotazník ve variantě A (1. osoba), zjednodušený vizuální styl, 7 otázek |
| 3 | Zodpovězte všech 7 otázek a odešlete | Průměr vyhodnocen, míra postižení určena |
| 4 | Přejděte na krok 3 — výběr tématu | Dostupná témata zvýrazněna, nedostupná označena „Připravujeme" |
| 5 | Vyberte téma, počkejte na generování, stáhněte sešit | Sešit stažen zdarma bez registrace |

#### TC-16.03: Onboarding — flow pro organizaci (přeskočení dotazníku) (High) [NOVÉ v2]

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Na landing page klikněte na kartu „Jsme organizace" | Spustí se onboarding průvodce s rolí „organizace" |
| 2 | Potvrďte roli | Krok 2 (dotazník) je PŘESKOČEN — organizace nevyplňuje dotazník (I7) |
| 3 | Zobrazí se přímo výběr tématu | Dostupná témata zvýrazněna, nedostupná označena „Připravujeme" |
| 4 | Vyberte téma a počkejte na generování | Vygenerovány 3 sešity (lehká/střední/těžší) |
| 5 | Stáhněte sešity | Sešity staženy zdarma bez registrace |

#### TC-16.04: Onboarding — výběr tématu zobrazuje dostupnost (High) [NOVÉ v2]

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | V onboarding průvodci přejděte na krok výběru tématu | Zobrazí se všechna témata (např. Rodina, Zahrada, Dům, Jaro, Domácí práce) |
| 2 | Zkontrolujte dostupná témata (splňující I8) | Dostupná témata mají zelený rámeček a tlačítko „Vybrat". Jsou klikatelná |
| 3 | Zkontrolujte nedostupná témata (nesplňující I8) | Nedostupná témata mají štítek „Připravujeme". NEJSOU klikatelná. Jsou vizuálně odlišena (šedá) |
| 4 | Pokuste se kliknout na nedostupné téma | Nic se nestane — téma nelze vybrat |

#### TC-16.05: Onboarding — data uložena v localStorage (Medium) [NOVÉ v2]

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Projděte onboarding průvodce (role, dotazník, téma) | Data se ukládají do localStorage pod klíčem `vt_onboarding` |
| 2 | Zkontrolujte localStorage v prohlížeči (DevTools) | localStorage obsahuje: roli, odpovědi dotazníku, severity level |

#### TC-16.06: Onboarding — stažení sešitu bez registrace (High) [NOVÉ v2]

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Projděte onboarding až ke stažení sešitu (bez přihlášení) | Sešit se vygeneruje a nabídne ke stažení |
| 2 | Stáhněte sešit | PDF se stáhne úspěšně. Uživatel NENÍ přihlášený, NEMÁ účet. Sešit je platný a kompletní |

---

### Modul 17 — PDF generování a stahování [NOVÉ v2]

#### TC-17.01: PDF sešit — validita a struktura (High) [NOVÉ v2]

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Vygenerujte sešit (přes onboarding nebo dashboard) | PDF soubor se úspěšně vygeneruje |
| 2 | Otevřete PDF v prohlížeči nebo PDF čtečce | PDF je validní, není poškozen, lze ho otevřít |
| 3 | Zkontrolujte počet stran | PDF má přesně 12 stran: 1 titulní strana + 10 stran s úkoly + 1 strana s instrukcemi |

#### TC-17.02: PDF sešit — český font s diakritikou (High) [NOVÉ v2]

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Otevřete vygenerovaný PDF sešit | PDF se otevře |
| 2 | Zkontrolujte český text s diakritikou | Všechny české znaky s diakritikou (háčky, čárky: č, ř, ž, š, á, é, í, ó, ú, ý, ď, ť, ň, ů) se zobrazují správně. Žádné „tofu" boxy, žádné náhradní znaky |

#### TC-17.03: PDF sešit — obrázky z DALL-E (High) [NOVÉ v2]

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Otevřete vygenerovaný PDF sešit | PDF se otevře |
| 2 | Zkontrolujte strany 2–11 (úkoly) | Každý úkol obsahuje grafickou část — obrázek vygenerovaný DALL-E 3. Obrázky se zobrazují korektně, nejsou prázdné ani rozmazané |
| 3 | Zkontrolujte titulní stranu | Titulní strana obsahuje tematický obrázek |

#### TC-17.04: PDF sešit — obsah titulní a instrukční strany (Medium) [NOVÉ v2]

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Zkontrolujte stranu 1 (titulní) | Obsahuje: název „Vlastním tempem — Pracovní sešit", název tématu, míru obtížnosti, tematický obrázek |
| 2 | Zkontrolujte stranu 12 (instrukce) | Obsahuje: instrukce pro pečující, jak sešit používat, doporučený postup, kontakt na organizaci |

---

### Modul 18 — Admin: Archiv a obnovení [NOVÉ v2]

#### TC-18.01: Admin Archiv — zobrazení archivovaných úkolů (Medium) [NOVÉ v2]

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Přihlaste se jako admin | Admin dashboard se zobrazí |
| 2 | Přejděte do sekce „Archiv" | Zobrazí se stránka `/admin/archive` se seznamem všech archivovaných úkolů |
| 3 | Zkontrolujte zobrazené informace | U každého úkolu je zobrazen: datum archivace, téma, obtížnost, kognitivní značky a obrázek (nebo placeholder) |

#### TC-18.02: Admin Archiv — obnovení úkolu do fronty revize (High) [NOVÉ v2]

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | V sekci „Archiv" vyberte archivovaný úkol | Náhled úkolu zobrazen |
| 2 | Klikněte na tlačítko „Obnovit" | Stav úkolu se změní z „Archivovaný" na „Ke schválení" |
| 3 | Přejděte do „Fronta ke schválení" | Obnovený úkol se objeví ve frontě ke schválení |
| 4 | Zkontrolujte, že úkol již není v Archivu | Úkol zmizel ze sekce Archiv |

#### TC-18.03: Admin Archiv — filtrování (Low) [NOVÉ v2]

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | V sekci „Archiv" použijte filtry (téma, obtížnost) | Filtrování funguje korektně, zobrazí se pouze úkoly odpovídající filtrům |

#### TC-18.04: Admin — navigace obsahuje Archiv (Medium) [NOVÉ v2]

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Přihlaste se jako admin | Admin navigace se zobrazí |
| 2 | Zkontrolujte položky navigace | Navigace obsahuje 7 položek včetně „Archiv". Archiv je přístupný z hlavní admin navigace |

#### TC-18.05: Admin — tlačítko odhlášení (Medium) [NOVÉ v2]

| Krok | Akce | Očekávaný výsledek |
|------|------|--------------------|
| 1 | Přihlaste se jako admin | Admin rozhraní se zobrazí |
| 2 | Zkontrolujte navigaci / hlavičku | V admin rozhraní je viditelné tlačítko pro odhlášení (není nutné přecházet do uživatelské části) |
| 3 | Klikněte na tlačítko odhlášení | Uživatel je odhlášen a přesměrován na přihlašovací stránku |

---

## 2. Akceptační kritéria

---

### Business-level akceptační kritéria

| ID | Kritérium |
|----|-----------|
| AK-B01 | Systém umožňuje registraci a přihlášení pro 3 typy uživatelů: osoba s postižením, pečující osoba, organizace |
| AK-B02 | Každý registrovaný uživatel obdrží ověřovací email a bez jeho potvrzení se nemůže přihlásit |
| AK-B03 | Formulář míry postižení pokrývá 5 dimenzí (paměť, orientace, pozornost, jazyk, samostatnost) prostřednictvím 7 otázek |
| AK-B04 | Formulář existuje ve dvou zněních: 1. osoba (pro osobu s postižením) a 3. osoba (pro pečující) |
| AK-B05 | Systém korektně vyhodnocuje míru postižení (lehká/střední/těžší) na základě průměru odpovědí se správnými prahovými hodnotami (1.6 / 1.7 a 2.3 / 2.4) |
| AK-B06 | Jednotlivec obdrží 1 PDF sešit (12 stran: titulní + 10 úkolů + instrukce) odpovídající jeho míře postižení a zvolenému tématu |
| AK-B07 | Organizace obdrží 3 PDF sešity (lehká/střední/těžší) pro zvolené téma, ke stažení jednotlivě i jako ZIP |
| AK-B08 | Freemium model: první sešit (jednotlivec) / první sada (organizace) je zdarma — včetně stažení bez registrace přes onboarding. Každý další vyžaduje aktivní předplatné [ZMĚNA v2] |
| AK-B09 | Stripe platba (testovací režim) umožňuje aktivaci dvou tarifů měsíčního předplatného |
| AK-B10 | Self-service zrušení předplatného funguje korektně — předplatné zůstává aktivní do konce fakturačního období |
| AK-B11 | Historie sešitů je dostupná i po expiraci předplatného, s možností opakovaného stažení |
| AK-B12 | Admin může dávkově generovat úkoly prostřednictvím AI (Claude API + DALL-E 3) s možností úpravy promptu před odesláním |
| AK-B13 | Admin může schvalovat/archivovat/zamítat úkoly. Pouze schválené úkoly vstupují do sešitů [ZMĚNA v2] |
| AK-B14 | Admin dashboard zobrazuje matici téma × obtížnost s indikací dostatku/nedostatku úkolů |
| AK-B15 | Téma je automaticky dostupné na frontendu, pokud má min. 10 schválených úkolů s min. 4 různými kognitivními tagy per obtížnost |
| AK-B16 | Onboarding průvodce umožňuje stažení prvního sešitu BEZ registrace (BL-001) [NOVÉ v2] |
| AK-B17 | Existují dva nezávislé registrační flow: přímá registrace (Flow A) a onboarding first (Flow B) (BL-006) [NOVÉ v2] |
| AK-B18 | Při registraci přes Flow B se data z onboardingu (dotazník, severity) automaticky přenesou do profilu (BL-006) [NOVÉ v2] |
| AK-B19 | Admin má v rozhraní tlačítko pro odhlášení (BL-007) [NOVÉ v2] |

### System-level akceptační kritéria

| ID | Kritérium |
|----|-----------|
| AK-S01 | Zjednodušený režim (CSS třída `simplified-mode`) se automaticky aktivuje pro roli „osoba_s_postížením": větší fonty, méně barev, klikací plochy min. 48×48 px |
| AK-S02 | Organizace neprochází formulářem míry postižení — vždy dostává 3 sešity (I7) |
| AK-S03 | Sešit obsahuje vždy přesně 10 úkolů (I9) |
| AK-S04 | Každý úkol v sešitu je ve stavu „Schválený" (I1) |
| AK-S05 | Každý úkol má přiřazené téma, obtížnost a alespoň jeden kognitivní tag (I3, I10) |
| AK-S06 | Sešit obsahuje úkoly s min. 4 různými kognitivními tagy (I4) |
| AK-S07 | Míra postižení musí být vyhodnocena před sestavením sešitu pro jednotlivce (I2) |
| AK-S08 | PDF sešit: formát A4, 12 stran, UTF-8, český font s diakritikou, grafika z DALL-E [ZMĚNA v2] |
| AK-S09 | Algoritmus výběru úkolů používá round-robin přes kognitivní tagy a seed per request (unikátní sešity) |
| AK-S10 | DALL-E 3 prompt obsahuje český kulturní kontext (D42) |
| AK-S11 | Sešit je neměnný po vygenerování — snapshot (A14) |
| AK-S12 | Formulář míry postižení je editovatelný — poslední stav přepisuje předchozí (A13) |
| AK-S13 | Stavový model úkolu: Vygenerovaný → Ke schválení → Schválený → (Archivovaný ↔ Ke schválení) / Zamítnutý [ZMĚNA v2] |
| AK-S14 | Částečné selhání AI generování: úspěšné úkoly se uloží, selhání se zalogují do error logu (A19) |
| AK-S15 | Error log zobrazuje selhání AI generování s možností retry |
| AK-S16 | Onboarding data se ukládají do localStorage a při registraci se přenášejí do DB (BL-001, BL-006) [NOVÉ v2] |
| AK-S17 | Admin navigace obsahuje 7 položek včetně Archivu (BL-002) [NOVÉ v2] |
| AK-S18 | Revizní fronta nabízí 3 akce: Schválit / Archivovat / Zamítnout (BL-003) [NOVÉ v2] |
| AK-S19 | Archivované úkoly lze obnovit zpět do fronty revize (BL-002) [NOVÉ v2] |
| AK-S20 | Onboarding výběr tématu zobrazuje dostupnost: dostupná témata mají zelený rámeček + „Vybrat", nedostupná mají „Připravujeme" a nejsou klikatelná (BL-008) [NOVÉ v2] |
| AK-S21 | Admin dashboard NEOBSAHUJE dotazník/assessment kartu pro admin roli [NOVÉ v2] |

---

## 3. Funkcionality nepokryté uživatelskými testy

---

| # | Funkcionalita | Důvod vyloučení z UAT | Doporučený typ testování |
|---|---------------|----------------------|--------------------------|
| 1 | **Claude API — kvalita generovaného textu** | Kvalita AI výstupů (srozumitelnost, adekvátní obtížnost, správný jazyk) závisí na promptu a modelu. Není testovatelná deterministicky v UAT. | A/B testování promptů, expertní review (psycholog), pilotní testování s reálnými uživateli |
| 2 | **DALL-E 3 — kvalita generované grafiky** | Vizuální styl, kulturní adekvátnost a vhodnost ilustrací pro cílovou skupinu nelze verifikovat standardním UAT scénářem. | Style guide validace, expertní review, pilotní testování |
| 3 | **Stripe webhook processing** | Asynchronní zpracování webhooků (payment_intent.succeeded, subscription.cancelled apod.) je backendová operace bez přímého uživatelského rozhraní. | Automatizované API testy, integrace testy Stripe webhook endpointu, simulace webhook events |
| 4 | **Stripe reconciliation** | Mechanismus obnovy stavu předplatného po selhání webhooku je interní backendový proces. | Automatizované integrace testy, chaos testing |
| 5 | **PDF generátor — technická kvalita** | Korektní rendering textu + grafiky v PDF, správné kódování UTF-8, layout A4, stránkování — technická implementace bez uživatelské interakce. | Automatizované unit/integration testy, vizuální regresní testy PDF výstupů |
| 6 | **AI API retry a graceful error handling** | Mechanismy opakovaného volání Claude API / DALL-E 3 při selhání a graceful degradace jsou interní backendové procesy. | Automatizované integrace testy, chaos testing, mock API testy |
| 7 | **Seed per request — unikátnost sešitů** | Statistická verifikace dostatečné náhodnosti výběru úkolů vyžaduje velký vzorek a není proveditelná v UAT. | Automatizované testy s generováním N sešitů a statistickou analýzou překryvu |
| 8 | **Concurrency: souběžné schvalování a generování** | Ověření, že souběžné admin akce (schvalování) a uživatelské akce (generování sešitů) nezpůsobí nekonzistentní stav, vyžaduje zátěžové testování. | Concurrency testy, zátěžové testy, databázové integrace testy |
| 9 | **Ověřovací email — doručitelnost** | Spolehlivost doručení emailu závisí na emailové infrastruktuře a konfiguraci DNS (SPF, DKIM). Není předmětem funkčního UAT. | Integrace testy emailového poskytovatele, monitoring doručitelnosti |
| 10 | **Bezpečnost: SQL injection, XSS, CSRF** | Bezpečnostní zranitelnosti jsou testovány specializovanými nástroji a metodami mimo scope UAT. | Penetrační testování, OWASP ZAP / Burp Suite, automatizované bezpečnostní skenery |
| 11 | **Výkonnost a škálovatelnost** | Odezva systému pod zátěží (pilotní skupina 10–15 jednotlivců, 2–3 organizace) a škálovatelnost. | Zátěžové testy (k6, JMeter), monitoring APM |
| 12 | **Databázová integrita a migrace** | Konzistence dat, referenční integrita, správnost migrací — infrastrukturní záležitost. | Automatizované databázové testy, migrační skripty s rollback testy |
| 13 | **GDPR / ochrana osobních údajů** | Správné nakládání s osobními údaji (email, odpovědi formuláře, platební metadata) — právní a compliance záležitost. | Audit GDPR compliance, penetrační testování zaměřené na data leakage |
| 14 | **localStorage bezpečnost a čištění** | Bezpečnost dat uložených v localStorage před registrací (onboarding data) a jejich korektní čištění po přenosu do DB. | Automatizované testy, security review [NOVÉ v2] |

---

*Dokument vygenerován: 2026-04-04*
*Verze: v2.0 (aktualizováno dle BACKLOG.md, BL-001 až BL-008)*
*Vstup: PAB_Vlastnim_tempem_v1.md (PAB v1), BACKLOG.md*
*Formát testů: Klasický (Krok — Akce — Očekávaný výsledek)*
*Doména: HealthTech / SocialTech — kognitivní rehabilitace*
