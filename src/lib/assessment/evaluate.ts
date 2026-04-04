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
    text_first_person: 'Když si vzpomenete na včerejší den (co jste dělali nebo jedli), jak snadno si to vybavujete?',
    text_third_person: 'Když si má vzpomenout na včerejší den (co dělal/a nebo jedl/a), jak snadno si to vybaví?',
    options: [
      { value: 1, label_first_person: 'Vybavím si to bez potíží', label_third_person: 'Vybaví si to bez potíží' },
      { value: 2, label_first_person: 'Občas mi nějaký detail vypadne', label_third_person: 'Občas mu/jí nějaký detail vypadne' },
      { value: 3, label_first_person: 'Často si nemohu vzpomenout', label_third_person: 'Často si nemůže vzpomenout' },
    ],
  },
  {
    id: 'q2',
    dimension: 'memory' as const,
    text_first_person: 'Jak je to se jmény vašich blízkých a přátel?',
    text_third_person: 'Jak je to se jmény blízkých a přátel?',
    options: [
      { value: 1, label_first_person: 'Vzpomenu si na všechna jména', label_third_person: 'Vzpomene si na všechna jména' },
      { value: 2, label_first_person: 'Někdy mi jméno na chvíli vypadne', label_third_person: 'Někdy mu/jí jméno na chvíli vypadne' },
      { value: 3, label_first_person: 'Často si nedokážu vzpomenout', label_third_person: 'Často si nedokáže vzpomenout' },
    ],
  },
  {
    id: 'q3',
    dimension: 'orientation' as const,
    text_first_person: 'Víte většinou, jaký je den v týdnu, měsíc nebo roční období?',
    text_third_person: 'Ví většinou, jaký je den v týdnu, měsíc nebo roční období?',
    options: [
      { value: 1, label_first_person: 'Ano, orientuji se dobře', label_third_person: 'Ano, orientuje se dobře' },
      { value: 2, label_first_person: 'Někdy si nejsem jistý/á', label_third_person: 'Někdy si není jistý/á' },
      { value: 3, label_first_person: 'Často mi to uniká', label_third_person: 'Často mu/jí to uniká' },
    ],
  },
  {
    id: 'q4',
    dimension: 'attention' as const,
    text_first_person: 'Když se pustíte do nějaké činnosti, dokážete se na ni soustředit?',
    text_third_person: 'Když se pustí do nějaké činnosti, dokáže se na ni soustředit?',
    options: [
      { value: 1, label_first_person: 'Soustředím se bez problémů', label_third_person: 'Soustředí se bez problémů' },
      { value: 2, label_first_person: 'Občas mě to stojí trochu úsilí', label_third_person: 'Občas to stojí trochu úsilí' },
      { value: 3, label_first_person: 'Je to pro mě hodně náročné', label_third_person: 'Je to hodně náročné' },
    ],
  },
  {
    id: 'q5',
    dimension: 'attention' as const,
    text_first_person: 'Když děláte něco po krocích (třeba vaření), udržíte přehled, kde jste skončili?',
    text_third_person: 'Když dělá něco po krocích (třeba vaření), udrží přehled, kde skončil/a?',
    options: [
      { value: 1, label_first_person: 'Ano, zvládám to dobře', label_third_person: 'Ano, zvládá to dobře' },
      { value: 2, label_first_person: 'Občas ztratím nit', label_third_person: 'Občas ztratí nit' },
      { value: 3, label_first_person: 'Často nevím, co bylo dál', label_third_person: 'Často neví, co bylo dál' },
    ],
  },
  {
    id: 'q6',
    dimension: 'language' as const,
    text_first_person: 'Když chcete něco říct nebo vysvětlit, najdete ta správná slova?',
    text_third_person: 'Když chce něco říct nebo vysvětlit, najde ta správná slova?',
    options: [
      { value: 1, label_first_person: 'Vyjadřuji se bez problémů', label_third_person: 'Vyjadřuje se bez problémů' },
      { value: 2, label_first_person: 'Občas mi správné slovo chvíli trvá', label_third_person: 'Občas mu/jí správné slovo chvíli trvá' },
      { value: 3, label_first_person: 'Často mi slova unikají', label_third_person: 'Často mu/jí slova unikají' },
    ],
  },
  {
    id: 'q7',
    dimension: 'independence' as const,
    text_first_person: 'Jak zvládáte každodenní věci jako oblékání, hygienu nebo přípravu jídla?',
    text_third_person: 'Jak zvládá každodenní věci jako oblékání, hygienu nebo přípravu jídla?',
    options: [
      { value: 1, label_first_person: 'Zvládám to sám/sama', label_third_person: 'Zvládá to sám/sama' },
      { value: 2, label_first_person: 'Někdy potřebuji trochu pomoci', label_third_person: 'Někdy potřebuje trochu pomoci' },
      { value: 3, label_first_person: 'Potřebuji pomoc pravidelně', label_third_person: 'Potřebuje pomoc pravidelně' },
    ],
  },
]
