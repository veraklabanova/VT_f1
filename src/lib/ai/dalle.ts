import OpenAI from 'openai'

let openai: OpenAI | null = null

function getClient() {
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
  }
  return openai
}

export async function generateExerciseImage(prompt: string): Promise<string> {
  const response = await getClient().images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  })

  const url = response.data?.[0]?.url
  if (!url) {
    throw new Error('No image URL from DALL-E')
  }
  return url
}
