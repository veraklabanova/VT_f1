import type { ExerciseWithTags, DifficultyLevel } from '@/types'

interface SelectionResult {
  exercises: ExerciseWithTags[]
  seed: number
}

// Seeded random number generator (mulberry32)
function seededRandom(seed: number) {
  let s = seed | 0
  return function () {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffleArray<T>(arr: T[], rng: () => number): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Select 10 exercises for a workbook using round-robin across cognitive tags.
 * Enforces invariants:
 * - I4: minimum 4 different cognitive tags
 * - I9: exactly 10 exercises
 */
export function selectExercises(
  allExercises: ExerciseWithTags[],
  themeId: string,
  difficulty: DifficultyLevel,
  seed?: number
): SelectionResult {
  const actualSeed = seed ?? Date.now()
  const rng = seededRandom(actualSeed)

  // Filter: correct theme, difficulty, approved status
  const eligible = allExercises.filter(
    (e) => e.theme_id === themeId && e.difficulty === difficulty && e.status === 'approved'
  )

  if (eligible.length < 10) {
    throw new Error(
      `Nedostatek cvičení: nalezeno ${eligible.length}, potřeba minimálně 10`
    )
  }

  // Group exercises by cognitive tag
  const tagGroups = new Map<string, ExerciseWithTags[]>()
  for (const exercise of eligible) {
    for (const tag of exercise.tags) {
      if (!tagGroups.has(tag.id)) {
        tagGroups.set(tag.id, [])
      }
      tagGroups.get(tag.id)!.push(exercise)
    }
  }

  // I4: must have at least 4 different tags
  if (tagGroups.size < 4) {
    throw new Error(
      `Nedostatek kognitivních značek: nalezeno ${tagGroups.size}, potřeba minimálně 4`
    )
  }

  // Shuffle exercises within each tag group
  const shuffledGroups = new Map<string, ExerciseWithTags[]>()
  for (const [tagId, exercises] of tagGroups) {
    shuffledGroups.set(tagId, shuffleArray(exercises, rng))
  }

  // Shuffle tag order for round-robin
  const tagOrder = shuffleArray(Array.from(shuffledGroups.keys()), rng)

  // Round-robin selection
  const selected = new Map<string, ExerciseWithTags>()
  const tagIndices = new Map<string, number>()
  for (const tagId of tagOrder) {
    tagIndices.set(tagId, 0)
  }

  let roundRobinIdx = 0
  while (selected.size < 10) {
    const tagId = tagOrder[roundRobinIdx % tagOrder.length]
    const group = shuffledGroups.get(tagId)!
    let idx = tagIndices.get(tagId)!

    // Find next exercise from this group not already selected
    let found = false
    while (idx < group.length) {
      const exercise = group[idx]
      if (!selected.has(exercise.id)) {
        selected.set(exercise.id, exercise)
        tagIndices.set(tagId, idx + 1)
        found = true
        break
      }
      idx++
    }

    if (!found) {
      tagIndices.set(tagId, group.length)
    }

    roundRobinIdx++

    // Safety: prevent infinite loop
    if (roundRobinIdx > tagOrder.length * eligible.length) {
      break
    }
  }

  if (selected.size < 10) {
    throw new Error(
      `Nepodařilo se vybrat 10 cvičení: vybráno pouze ${selected.size}`
    )
  }

  const result = Array.from(selected.values())

  // Verify I4: at least 4 different tags
  const usedTags = new Set<string>()
  for (const exercise of result) {
    for (const tag of exercise.tags) {
      usedTags.add(tag.id)
    }
  }
  if (usedTags.size < 4) {
    throw new Error(
      `Nedostatečná diverzita kognitivních značek: ${usedTags.size} (minimum 4)`
    )
  }

  return {
    exercises: shuffleArray(result, rng),
    seed: actualSeed,
  }
}

/**
 * Check I8: theme is available if it has >=10 approved exercises
 * with >=4 unique cognitive tags per difficulty level
 */
export function checkThemeAvailability(
  exercises: ExerciseWithTags[],
  themeId: string,
  requiredDifficulties: DifficultyLevel[]
): boolean {
  for (const difficulty of requiredDifficulties) {
    const filtered = exercises.filter(
      (e) => e.theme_id === themeId && e.difficulty === difficulty && e.status === 'approved'
    )

    if (filtered.length < 10) return false

    const tags = new Set<string>()
    for (const e of filtered) {
      for (const tag of e.tags) {
        tags.add(tag.id)
      }
    }
    if (tags.size < 4) return false
  }

  return true
}
