// PDF generation will use @react-pdf/renderer
// This is a placeholder for the PDF generation logic
// Actual implementation requires server-side rendering

import type { ExerciseWithTags, Theme, DifficultyLevel } from '@/types'

const difficultyLabels: Record<DifficultyLevel, string> = {
  lehka: 'Lehká',
  stredni: 'Střední',
  tezsi: 'Těžší',
}

export interface WorkbookPDFData {
  theme: Theme
  difficulty: DifficultyLevel
  exercises: ExerciseWithTags[]
}

// Note: @react-pdf/renderer PDF generation is implemented
// in the API route due to server-side requirements.
// This file provides helper functions for PDF data preparation.

export function prepareWorkbookData(
  theme: Theme,
  difficulty: DifficultyLevel,
  exercises: ExerciseWithTags[]
): WorkbookPDFData {
  if (exercises.length !== 10) {
    throw new Error(`Workbook must contain exactly 10 exercises, got ${exercises.length}`)
  }

  return { theme, difficulty, exercises }
}

export function getDifficultyLabel(difficulty: DifficultyLevel): string {
  return difficultyLabels[difficulty]
}
