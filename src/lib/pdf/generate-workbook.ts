import React from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import { WorkbookDocument } from './workbook-document'
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

export function getDifficultyLabel(difficulty: DifficultyLevel): string {
  return difficultyLabels[difficulty]
}

export async function generateWorkbookPDF(
  theme: Theme,
  difficulty: DifficultyLevel,
  exercises: ExerciseWithTags[]
): Promise<Buffer> {
  const doc = React.createElement(WorkbookDocument, {
    theme,
    difficulty,
    difficultyLabel: difficultyLabels[difficulty],
    exercises,
  })

  const buffer = await renderToBuffer(doc)
  return Buffer.from(buffer)
}
