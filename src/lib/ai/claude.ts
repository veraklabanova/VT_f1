import Anthropic from '@anthropic-ai/sdk'

let anthropic: Anthropic | null = null

function getClient() {
  if (!anthropic) {
    anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
  }
  return anthropic
}

export async function generateExerciseText(prompt: string): Promise<string> {
  const message = await getClient().messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const textBlock = message.content.find((b) => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from Claude')
  }
  return textBlock.text.trim()
}
