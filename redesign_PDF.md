Stránka s úkolem: 

# Vlastním tempem — Specifikace tiskového layoutu PDF
**Verze:** 1.0 | **Datum:** 2025  
**Figma:** `D4lWM0UmbRtX3U6BQNMQbV` — stránky `📄 PDF – Titulní strana` a `📄 PDF – Stránka s úkolem`  
**CSS design system:** `vlastnim-tempem-design-system.css`

---

## Společná nastavení obou stránek

### Formát a rozlišení

| Parametr | Hodnota |
|---|---|
| Formát | A4 na výšku |
| Rozměry (tisk) | 210 × 297 mm |
| Rozměry (screen / Figma, 96 dpi) | 794 × 1123 px |
| Rozměry (export pro tisk, 300 dpi) | 2480 × 3508 px |
| Barevný prostor | RGB (screen PDF) — při tisku převést do CMYK |
| Bezpečná zóna / margins | 48 px = 12,7 mm po stranách |

> **Převodní klíč:** 1 px (Figma / 96 dpi) = 0,2646 mm.  
> Všechny px hodnoty v tomto dokumentu odpovídají Figma rozměrům (96 dpi).

### CSS `@page`

```css
@page {
  size: A4 portrait;          /* 210mm × 297mm */
  margin: 0;                  /* layout řídí vlastní padding */
}

@media print {
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact; /* zachovat barvy pozadí */
  }
}
```

### Barevné tokeny (Varianta B — finální)

| Token | Hex | Použití |
|---|---|---|
| `--color-bg-primary` | `#FDF6EE` | Hlavní pozadí stránek |
| `--color-bg-section` | `#FFE4C0` | Footer, alternativní plochy |
| `--color-amber` | `#B5660A` | Primární akcent, oddělovač |
| `--color-amber-light` | `#FDECD6` | Chip pozadí |
| `--color-sage` | `#2E6B2A` | Levý accent bar karet, difficulty badge |
| `--color-sage-light` | `#C5E4C2` | Placeholder pozadí ilustrace |
| `--color-terra-light` | `#F5C5BC` | Pill „3 dovednosti" |
| `--color-card` | `#FFFFFF` | Bílé karty |
| `--color-border` | `#C4A882` | Lehký border (image frame, pills) |
| `--color-border-strong` | `#8F6A40` | Silný border karet s textem |
| `--color-text-primary` | `#1A1208` | Nadpisy, tělo textu |
| `--color-text-secondary` | `#4A3520` | Metadata, popisky, footer text |
| `--color-text-on-dark` | `#FFFFFF` | Text na tmavých plochách |

### Typografie (font: Inter)

| Styl | Weight | Velikost | Line-height | Použití |
|---|---|---|---|---|
| Extra Bold | 800 | 34 px | 120 % | Headline (slogan) |
| Extra Bold | 800 | 40 px | auto | Název tématu |
| Bold | 700 | 15 px | auto | Číslo cvičení |
| Semi Bold | 600 | 13 px | auto | Popisky pillů, „Moje odpovědi:", chip |
| Semi Bold | 600 | 11 px | auto | Difficulty badge, číslo stránky |
| Regular | 400 | 14 px | 165 % | Tělo instrukčního textu |
| Regular | 400 | 13 px | auto | „Pracovní sešit", pill text |
| Regular | 400 | 11 px | auto | Footer text, placeholder label |
| Regular | 400 | 10 px | auto | Skill tagy v hlavičce |

### Sdílená pravidla — karta s accent barem

Platí pro **instrukční kartu** i kartu **„Moje odpovědi"** na stránce s úkolem.

- Pozadí: `#FFFFFF`
- Border: **2 px, `#8F6A40`, outside** (v CSS = `outline: 2px solid #8F6A40`)
- Border-radius: 20 px
- Shadow: `0 4px 14px rgba(26,18,5,0.14)`
- Levý accent bar: 5 px × plná výška karty, `#2E6B2A`, pozice x:0, y:0
- `overflow: hidden` — accent bar je oříznut zakulacenými rohy

### Sdílená pravidla — footer

Shodný na obou stránkách:

- Pozadí: `#FFE4C0`
- Výška: 48 px, pozice: y:1075
- Horní rohy: radius 12 px | Dolní rohy: 0
- Horní linka: 3 × 794 px, `#B5660A`
- Levý text: x:24, y:18, Regular 11 px, `#4A3520`
- Pravý prvek: x:624, y:10 (titulní strana) nebo right − 24 px (stránka s úkolem)

---

## 1. Titulní strana (Cover Page)

**Figma node:** `29:2`

### Přehled vrstev (top → bottom)

```
y:    0 px │ Pozadí stránky  #FDF6EE
y:   40 px │ Headline řádek 1
y:   86 px │ Headline řádek 2 (amber)
y:  136 px │ Podtitul
y:  162 px │ Oddělovací linka
y:  178 px │ Image Placeholder outer
y:  194 px │ Image Inner (tisková plocha)
y:  614 px │ Topic Card
y:  748 px │ Info pills (2×)
y: 1075 px │ Footer
```

### Headline sekce

Texty přímo na cream pozadí, bez obalového framu.

| Prvek | x | y | Šířka | Font | Barva |
|---|---|---|---|---|---|
| „Trénujte paměť a myšlení." | 180 | 40 | 435 | Extra Bold 34 px / LH 120 % | `#1A1208` |
| „V klidu a vlastním tempem." | 170 | 86 | 454 | Extra Bold 34 px / LH 120 % | `#B5660A` |
| „Pracovní sešit" | 354 | 136 | 86 | Regular 13 px | `#4A3520` |

**Oddělovací linka:** x:48, y:162, 698 × 1 px, `#B5660A` @ 30 % opacity.

### Image Placeholder

Dvě vrstvené plochy — outer halo + inner tisková plocha.

| Vrstva | x | y | Š | V | Barva | Radius | Border |
|---|---|---|---|---|---|---|---|
| Outer (sage halo) | 187 | 178 | 420 | 420 | `#C5E4C2` @ 45 % | 20 px | — |
| Inner (tisková plocha) | 207 | 194 | 380 | 380 | `#FFFFFF` | 20 px | 1 px `#C4A882` inside |

Ilustrace se vkládá do **Inner** jako `<img object-fit: contain>` nebo `background-image`.

### Topic Card

| Parametr | Hodnota |
|---|---|
| Pozice | x:197, y:614 |
| Rozměr | 400 × 118 px |
| Pozadí | `#FFE4C0` |
| Border | 1,5 px `#C4A882` outside |
| Border-radius | 20 px |
| `overflow` | hidden |
| Levý accent bar | 5 × 118 px, `#B5660A`, x:0, y:0 |

Obsah (souřadnice uvnitř karty):

| Prvek | x | y | Font | Barva |
|---|---|---|---|---|
| „téma sešitu" | vycentrováno | 16 | Regular 11 px | `#4A3520` |
| Název tématu | vycentrováno | 36 | Extra Bold 40 px | `#1A1208` |

### Info Pills

Dvě pill-tlačítka, mezerník 16 px.

| Pill | x | y | Š | V | Pozadí | Border |
|---|---|---|---|---|---|---|
| „10 cvičení" | 249 | 748 | 140 | 34 | `#FDECD6` | 1 px `#C4A882` inside |
| „3 dovednosti" | 405 | 748 | 140 | 34 | `#F5C5BC` | 1 px `#C4A882` inside |

- Radius: 17 px | Text: Semi Bold 13 px, `#1A1208`, horizontálně vycentrováno

### Footer — Titulní strana

| Prvek | x | y | Font | Barva |
|---|---|---|---|---|
| „Kognitivní trénink vlastním tempem" | 24 | 18 | Regular 11 px | `#4A3520` |
| Difficulty Badge | 624 | 10 | — | — |

**Difficulty Badge:** 152 × 28 px, `#2E6B2A`, radius 14 px.  
Text: „Obtížnost: Lehká", Semi Bold 11 px, `#FFFFFF`, vycentrováno.

---

## 2. Stránka s úkolem (Exercise Page)

**Figma node:** `35:2`

### Přehled vrstev (top → bottom)

```
y:    0 px │ Pozadí stránky  #FDF6EE
y:   20 px │ Číslo cvičení + skill tagy
y:   50 px │ Oddělovací linka
y:   66 px │ Topic Chip
y:  108 px │ Instrukční karta
y:  324 px │ Image Placeholder outer
y:  340 px │ Image Inner
y:  835 px │ Karta „Moje odpovědi"
y: 1075 px │ Footer
```

### Hlavička (bez barevného pozadí)

Texty přímo na cream pozadí stránky.

| Prvek | x | y | Font | Barva |
|---|---|---|---|---|
| „Cvičení 1 / 10" | 48 | 20 | Bold 15 px | `#1A1208` |
| Skill tagy | pravý okraj − 20 | 22 | Regular 10 px | `#4A3520` |

Skill tag text: `Jazykové dovednosti · Vizuální vnímání · Paměť · Pozornost`

**Oddělovací linka:** x:48, y:50, 698 × 1 px, `#B5660A` @ 35 % opacity.

### Topic Chip

| Parametr | Hodnota |
|---|---|
| Pozice | x:48, y:66 |
| Rozměr | 110 × 26 px |
| Pozadí | `#FDECD6` |
| Radius | 13 px |
| Text | „🌻  Rodina", Semi Bold 11 px, `#B5660A`, padding x:12, y:7 |

### Instrukční karta

Viz sdílená pravidla — karta s accent barem (výše).

| Parametr | Hodnota |
|---|---|
| Pozice | x:48, y:108 |
| Rozměr | 698 × 200 px |
| Accent bar barva | `#2E6B2A` (sage) |

Text uvnitř karty: x:24, y:18, šířka 650 px, Regular 14 px / LH 165 %, `#1A1208`.

### Image Placeholder

| Vrstva | x | y | Š | V | Barva | Radius | Border |
|---|---|---|---|---|---|---|---|
| Outer (sage halo) | 167 | 324 | 460 | 420 | `#C5E4C2` @ 45 % | 24 px | — |
| Inner (tisková plocha) | 183 | 340 | 428 | 388 | `#FFFFFF` | 16 px | 1,5 px `#C4A882` inside |

### Karta „Moje odpovědi"

Viz sdílená pravidla — karta s accent barem (výše).

| Parametr | Hodnota |
|---|---|
| Pozice | x:48, y:835 |
| Rozměr | 698 × 228 px |
| Shadow | `0 3px 12px rgba(26,18,5,0.12)` |
| Accent bar barva | `#2E6B2A` (sage) |

Obsah (souřadnice uvnitř karty):

| Prvek | x | y | Šířka | Font / Barva |
|---|---|---|---|---|
| Label „Moje odpovědi:" | 24 | 18 | — | Semi Bold 13 px, `#4A3520` |
| Řádek 1 | 24 | 48 | 650 | 1,5 px výška, `#8F6A40` |
| Řádek 2 | 24 | 88 | 650 | 1,5 px výška, `#8F6A40` |
| Řádek 3 | 24 | 128 | 650 | 1,5 px výška, `#8F6A40` |
| Řádek 4 | 24 | 168 | 650 | 1,5 px výška, `#8F6A40` |
| Řádek 5 | 22 | 208 | 646 | 1,5 px výška, `#8F6A40` |

Rozestup řádků: 40 px.

### Footer — Stránka s úkolem

| Prvek | x | y | Font | Barva |
|---|---|---|---|---|
| Název tématu (např. „Rodina") | 24 | 18 | Regular 11 px | `#4A3520` |
| Číslo stránky | pravý okraj − 24 | 18 | Semi Bold 11 px | `#B5660A` |

---

## CSS snippety pro vývojáře

### Karta s accent barem

```css
.content-card {
  position: relative;
  background: #FFFFFF;
  border-radius: 20px;
  outline: 2px solid #8F6A40;   /* outside border — nezmenšuje vnitřní prostor */
  box-shadow: 0 4px 14px rgba(26, 18, 5, 0.14);
  overflow: hidden;              /* ořízne accent bar na zakulacených rozích */
}

.content-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 5px; height: 100%;
  background: #2E6B2A;           /* sage accent bar */
}

.content-card__body {
  padding: 18px 24px;
}
```

### Řádky pro odpovědi

```css
.answer-lines {
  padding: 48px 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 38.5px;                   /* výsledný rozestup středů řádků = 40 px */
}

.answer-line {
  height: 1.5px;
  background: #8F6A40;
}
```

### Footer

```css
.pdf-footer {
  position: absolute;
  bottom: 0; left: 0;
  width: 100%; height: 48px;
  background: #FFE4C0;
  border-radius: 12px 12px 0 0;
  border-top: 3px solid #B5660A;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: #4A3520;
  box-sizing: border-box;
}

.pdf-footer__badge {
  background: #2E6B2A;
  color: #FFFFFF;
  font-weight: 600;
  font-size: 11px;
  padding: 5px 14px;
  border-radius: 14px;
  white-space: nowrap;
}
```

### Generování PDF (Puppeteer)

```js
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setContent(htmlString, { waitUntil: 'networkidle0' });
const pdf = await page.pdf({
  format: 'A4',
  printBackground: true,   // zachová barvy pozadí
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
});
await browser.close();
```

---

## Důležité poznámky pro tisk

**`print-color-adjust: exact`** musí být nastaveno globálně — bez tohoto pravidla prohlížeče při tisku vypínají barevná pozadí.

**Outside border** karet je v CSS realizován pomocí `outline`, nikoliv `border`. `border` by zmenšil vnitřní prostor karty a posunul accent bar. Alternativně lze použít `box-shadow: 0 0 0 2px #8F6A40` (neovlivňuje layout).

**Vkládání ilustrací** — ilustrace patří do `Image Inner` framu (bílá plocha). Doporučujeme `object-fit: contain` s 16 px border-radius a zachovaným border `1,5 px #C4A882`.

**Fonty** — Inter je nutné embedovat jako Base64 nebo načíst přes Google Fonts před generováním PDF. Chybějící font způsobí nesprávné zalomení textu a posunutí prvků.

**CMYK přibližné ekvivalenty** (pro ofsetový tisk):

| RGB | CMYK |
|---|---|
| `#B5660A` | C0 M58 Y95 K29 |
| `#2E6B2A` | C57 M0 Y61 K58 |
| `#FDF6EE` | C0 M1 Y6 K1 |
| `#FFE4C0` | C0 M11 Y25 K0 |
| `#8F6A40` | C0 M26 Y56 K44 |

---

*Figma: https://www.figma.com/design/D4lWM0UmbRtX3U6BQNMQbV*  
*CSS design system: vlastnim-tempem-design-system.css*