import type { DifficultyLevel } from '@/types'

const difficultyDescriptions: Record<DifficultyLevel, string> = {
  lehka: 'lehká obtížnost — pro osoby s mírným kognitivním postižením, které zvládají většinu aktivit s občasnou podporou',
  stredni: 'střední obtížnost — pro osoby potřebující pravidelnou asistenci, zjednodušené úkoly',
  tezsi: 'těžší obtížnost — pro osoby potřebující stálou podporu, velmi jednoduché úkoly',
}

export function buildExercisePrompt(
  theme: string,
  difficulty: DifficultyLevel,
  cognitiveFunction: string,
  customPrompt?: string
): string {
  const base = `Vytvoř kognitivní cvičení v češtině na téma "${theme}".

Parametry:
- Obtížnost: ${difficultyDescriptions[difficulty]}
- Kognitivní funkce: ${cognitiveFunction}
- Cvičení musí být jasně formulované, s jednoznačným zadáním
- Text musí být srozumitelný pro cílovou skupinu (osoby s kognitivním postižením)
- Kontext: české kulturní prostředí, středoevropské reálie

Formát odpovědi:
Vrať pouze text cvičení (zadání pro uživatele). Bez nadpisů, číslování nebo dalších metadat.
Délka: 2-5 vět.`

  return customPrompt ? `${base}\n\nDodatečné pokyny: ${customPrompt}` : base
}

export function buildImagePrompt(
  theme: string,
  exerciseText: string
): string {
  return `Simple, warm, friendly illustration for a cognitive exercise workbook.
Theme: ${theme}
Exercise context: ${exerciseText}
Style: Clean, simple line art with soft colors. Suitable for elderly people.
Setting: Central European, Czech traditional context.
No text in the image. No complex scenes. One clear subject.
Format: Square illustration, white or light background.`
}
