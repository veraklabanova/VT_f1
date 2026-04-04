import type { SeverityLevel } from '@/types'

export function computeSeverity(answers: number[]): {
  averageScore: number
  severity: SeverityLevel
} {
  if (answers.length !== 7) {
    throw new Error('Assessment requires exactly 7 answers')
  }
  for (const a of answers) {
    if (a < 1 || a > 3 || !Number.isInteger(a)) {
      throw new Error('Each answer must be 1, 2, or 3')
    }
  }

  const sum = answers.reduce((acc, val) => acc + val, 0)
  const averageScore = Math.round((sum / 7) * 100) / 100

  let severity: SeverityLevel
  if (averageScore <= 1.6) {
    severity = 'lehka'
  } else if (averageScore <= 2.3) {
    severity = 'stredni'
  } else {
    severity = 'tezsi'
  }

  return { averageScore, severity }
}

export const ASSESSMENT_QUESTIONS = [
  {
    id: 'q1',
    dimension: 'memory' as const,
    text_first_person: 'Jak dobře si pamatuji nedávné události (co jsem dělal/a včera, co jsem jedl/a)?',
    text_third_person: 'Jak dobře si pamatuje nedávné události (co dělal/a včera, co jedl/a)?',
    options: [
      { value: 1, label_first_person: 'Pamatuji si dobře', label_third_person: 'Pamatuje si dobře' },
      { value: 2, label_first_person: 'Občas zapomínám', label_third_person: 'Občas zapomíná' },
      { value: 3, label_first_person: 'Často zapomínám', label_third_person: 'Často zapomíná' },
    ],
  },
  {
    id: 'q2',
    dimension: 'memory' as const,
    text_first_person: 'Jak dobře si pamatuji jména blízkých lidí?',
    text_third_person: 'Jak dobře si pamatuje jména blízkých lidí?',
    options: [
      { value: 1, label_first_person: 'Pamatuji si všechna jména', label_third_person: 'Pamatuje si všechna jména' },
      { value: 2, label_first_person: 'Některá jména mi občas uniknou', label_third_person: 'Některá jména mu/jí občas uniknou' },
      { value: 3, label_first_person: 'Často si nevzpomenu na jména', label_third_person: 'Často si nevzpomene na jména' },
    ],
  },
  {
    id: 'q3',
    dimension: 'orientation' as const,
    text_first_person: 'Jak se orientuji v čase (vím, jaký je den, měsíc, roční období)?',
    text_third_person: 'Jak se orientuje v čase (ví, jaký je den, měsíc, roční období)?',
    options: [
      { value: 1, label_first_person: 'Orientuji se dobře', label_third_person: 'Orientuje se dobře' },
      { value: 2, label_first_person: 'Někdy si nejsem jistý/á', label_third_person: 'Někdy si není jistý/á' },
      { value: 3, label_first_person: 'Často nevím, jaký je den', label_third_person: 'Často neví, jaký je den' },
    ],
  },
  {
    id: 'q4',
    dimension: 'attention' as const,
    text_first_person: 'Jak dlouho se dokážu soustředit na jednu činnost?',
    text_third_person: 'Jak dlouho se dokáže soustředit na jednu činnost?',
    options: [
      { value: 1, label_first_person: 'Soustředím se bez problémů', label_third_person: 'Soustředí se bez problémů' },
      { value: 2, label_first_person: 'Soustředění mi občas dělá potíže', label_third_person: 'Soustředění mu/jí občas dělá potíže' },
      { value: 3, label_first_person: 'Velmi těžko se soustředím', label_third_person: 'Velmi těžko se soustředí' },
    ],
  },
  {
    id: 'q5',
    dimension: 'attention' as const,
    text_first_person: 'Jak zvládám sledovat postup v úkolu (co jsem už udělal/a, co je další krok)?',
    text_third_person: 'Jak zvládá sledovat postup v úkolu (co už udělal/a, co je další krok)?',
    options: [
      { value: 1, label_first_person: 'Zvládám to dobře', label_third_person: 'Zvládá to dobře' },
      { value: 2, label_first_person: 'Občas ztratím přehled', label_third_person: 'Občas ztratí přehled' },
      { value: 3, label_first_person: 'Často nevím, kde jsem skončil/a', label_third_person: 'Často neví, kde skončil/a' },
    ],
  },
  {
    id: 'q6',
    dimension: 'language' as const,
    text_first_person: 'Jak se mi daří vyjadřovat myšlenky slovy?',
    text_third_person: 'Jak se mu/jí daří vyjadřovat myšlenky slovy?',
    options: [
      { value: 1, label_first_person: 'Vyjadřuji se bez problémů', label_third_person: 'Vyjadřuje se bez problémů' },
      { value: 2, label_first_person: 'Občas hledám správné slovo', label_third_person: 'Občas hledá správné slovo' },
      { value: 3, label_first_person: 'Často mi slova chybí', label_third_person: 'Často mu/jí slova chybí' },
    ],
  },
  {
    id: 'q7',
    dimension: 'independence' as const,
    text_first_person: 'Jak zvládám běžné denní činnosti (oblékání, hygiena, příprava jídla)?',
    text_third_person: 'Jak zvládá běžné denní činnosti (oblékání, hygiena, příprava jídla)?',
    options: [
      { value: 1, label_first_person: 'Zvládám samostatně', label_third_person: 'Zvládá samostatně' },
      { value: 2, label_first_person: 'Potřebuji občasnou pomoc', label_third_person: 'Potřebuje občasnou pomoc' },
      { value: 3, label_first_person: 'Potřebuji pravidelnou pomoc', label_third_person: 'Potřebuje pravidelnou pomoc' },
    ],
  },
]
