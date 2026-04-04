import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Zadejte platný email'),
  password: z.string().min(8, 'Heslo musí mít alespoň 8 znaků'),
  role: z.enum(['osoba_s_postizenim', 'pecujici', 'organizace']),
  organization_name: z.string().optional(),
  contact_info: z.string().optional(),
}).refine(
  (data) => {
    if (data.role === 'organizace') {
      return !!data.organization_name && data.organization_name.length > 0
    }
    return true
  },
  { message: 'Název organizace je povinný', path: ['organization_name'] }
)

export const loginSchema = z.object({
  email: z.string().email('Zadejte platný email'),
  password: z.string().min(1, 'Zadejte heslo'),
})

export const assessmentSchema = z.object({
  q1: z.number().int().min(1).max(3),
  q2: z.number().int().min(1).max(3),
  q3: z.number().int().min(1).max(3),
  q4: z.number().int().min(1).max(3),
  q5: z.number().int().min(1).max(3),
  q6: z.number().int().min(1).max(3),
  q7: z.number().int().min(1).max(3),
})

export const generateBatchSchema = z.object({
  theme_id: z.string().uuid(),
  difficulty: z.enum(['lehka', 'stredni', 'tezsi']),
  cognitive_tag_ids: z.array(z.string().uuid()).min(1),
  count: z.number().int().min(1).max(20),
  prompt_text: z.string().min(10),
  prompt_image: z.string().optional(),
})

export const workbookRequestSchema = z.object({
  theme_id: z.string().uuid(),
  difficulty: z.enum(['lehka', 'stredni', 'tezsi']).optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type AssessmentInput = z.infer<typeof assessmentSchema>
export type GenerateBatchInput = z.infer<typeof generateBatchSchema>
export type WorkbookRequestInput = z.infer<typeof workbookRequestSchema>
