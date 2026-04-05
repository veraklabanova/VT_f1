import type { DifficultyLevel } from '@/types'

const difficultyDescriptions: Record<DifficultyLevel, string> = {
  lehka: `lehká obtížnost — pro osoby s těžším kognitivním postižením, které potřebují stálou podporu.
Pravidla:
- Maximálně 2 velmi krátké věty
- Jeden jednoduchý úkol (pojmenuj, ukaž, vyber z 2-3 možností)
- Žádné vícekrokové instrukce
- Používej konkrétní, každodenní slova
- Odpověď by měla být zřejmá z obrázku nebo kontextu`,

  stredni: `střední obtížnost — pro osoby s mírným až středním kognitivním postižením, které potřebují občasnou pomoc.
Pravidla:
- 2-3 věty
- Úkol může mít 2 jednoduché kroky (např. najdi a spočítej)
- Vyber ze 3-4 možností, nebo krátká volná odpověď
- Jasné, srozumitelné pokyny bez odborných výrazů`,

  tezsi: `těžší obtížnost — pro osoby s mírným kognitivním postižením, které zvládají většinu aktivit samostatně.
Pravidla:
- 3-5 vět
- Může obsahovat vícekrokové instrukce (seřaď, porovnej, vysvětli)
- Otevřené otázky, logické uvažování, vzpomínání
- Složitější kontext, ale stále srozumitelný jazyk`,
}

export function buildExercisePrompt(
  theme: string,
  difficulty: DifficultyLevel,
  cognitiveFunction: string,
  customPrompt?: string,
  imageRole?: 'illustration' | 'functional'
): string {
  let base = `Vytvoř kognitivní cvičení v češtině na téma "${theme}".

Parametry:
- Obtížnost: ${difficultyDescriptions[difficulty]}
- Kognitivní funkce: ${cognitiveFunction}
- Cvičení musí být jasně formulované, s jednoznačným zadáním
- Text musí být srozumitelný pro cílovou skupinu (osoby s kognitivním postižením)
- Kontext: české kulturní prostředí, středoevropské reálie

Formát odpovědi:
Vrať pouze text cvičení (zadání pro uživatele). Bez nadpisů, číslování nebo dalších metadat.`

  if (imageRole === 'functional') {
    base += `

DŮLEŽITÉ: Obrázek bude mít FUNKČNÍ roli v úkolu — uživatel bude pracovat přímo s obrázkem.
Příklady: „Spočítejte předměty na obrázku", „Spojte obrázky do dvojic", „Najděte skrytý předmět",
„Seřaďte obrázky podle velikosti", „Zakroužkujte správný obrázek".
Formuluj zadání tak, aby odkazovalo na obrázek a bez obrázku nebylo řešitelné.`
  }

  return customPrompt ? `${base}\n\nDodatečné pokyny: ${customPrompt}` : base
}

export function buildImagePrompt(
  theme: string,
  exerciseText: string,
  imageRole: 'illustration' | 'functional' = 'illustration'
): string {
  const base = `Illustration for a cognitive exercise workbook.
Theme: ${theme}
Exercise: ${exerciseText}

VISUAL IDENTITY (follow precisely for every image):
- Style: Flat vector illustration, NO gradients, NO shadows, NO 3D effects
- Outlines: Consistent 3px dark gray (#4A4A4A) outlines on all shapes
- Color palette: Use ONLY these colors (up to 11 max, fewer is fine):
  white, yellow, pink, red, orange, blue, purple, green, brown, gray, black.
  Use muted/pastel versions of these colors. No neon or saturated tones.
  Keep the palette consistent across all images.
- Shapes: Rounded, slightly imperfect organic forms (not geometric precision)
- Figures: Simple, friendly characters with dot eyes, a small simplified nose,
  and a simple curved line for the mouth. Always include eyes, nose, and mouth —
  never omit any facial feature. Bodies are rounded, proportions slightly
  stylized (larger heads).
- Background: Plain white (#FFFFFF), no background elements or patterns
- Composition: Single centered subject or small group, generous white space
- Texture: None — perfectly flat fills only
- Mood: Warm, calm, approachable — like a premium children's book for adults

CONTENT RULES:
- Maximum 3 distinct objects/elements in the scene
- Every element mentioned in the exercise MUST appear in the image
- Do NOT add elements not mentioned in the exercise
- If the exercise mentions specific colors, those exact colors must be present
- If the exercise mentions a specific number of items, show exactly that number
- No text, numbers, or letters in the image

Format: Square, 1024x1024.`

  if (imageRole === 'functional') {
    return base + `

FUNCTIONAL IMAGE: The user works directly with this image.
Make each element clearly distinct, well-separated, and easy to point at or count.
Leave generous spacing between elements. Each item should be at least 150px in size.`
  }

  return base
}
