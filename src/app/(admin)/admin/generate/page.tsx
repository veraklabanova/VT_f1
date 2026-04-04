'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { buildExercisePrompt } from '@/lib/ai/prompts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Loader2, Wand2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Theme, CognitiveTag, DifficultyLevel } from '@/types'

const difficulties: { value: DifficultyLevel; label: string }[] = [
  { value: 'lehka', label: 'Lehká' },
  { value: 'stredni', label: 'Střední' },
  { value: 'tezsi', label: 'Těžší' },
]

const MOCK_THEMES: Theme[] = [
  { id: '1', name: 'Rodina', description: null, cover_image_url: null, created_at: '' },
  { id: '2', name: 'Zahrada', description: null, cover_image_url: null, created_at: '' },
  { id: '3', name: 'Dům', description: null, cover_image_url: null, created_at: '' },
  { id: '4', name: 'Jaro', description: null, cover_image_url: null, created_at: '' },
  { id: '5', name: 'Domácí práce', description: null, cover_image_url: null, created_at: '' },
]

const MOCK_TAGS: CognitiveTag[] = [
  { id: 't1', name: 'memory', label_cs: 'Paměť' },
  { id: 't2', name: 'attention', label_cs: 'Pozornost' },
  { id: 't3', name: 'orientation', label_cs: 'Orientace' },
  { id: 't4', name: 'logical_thinking', label_cs: 'Logické myšlení' },
  { id: 't5', name: 'language_skills', label_cs: 'Jazykové dovednosti' },
  { id: 't6', name: 'visual_perception', label_cs: 'Vizuální vnímání' },
]

export default function GeneratePage() {
  const [themes, setThemes] = useState<Theme[]>(MOCK_THEMES)
  const [tags, setTags] = useState<CognitiveTag[]>(MOCK_TAGS)
  const [themeId, setThemeId] = useState('')
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('lehka')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [count, setCount] = useState(5)
  const [promptText, setPromptText] = useState('')
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        const [{ data: t, error: tErr }, { data: c, error: cErr }] = await Promise.all([
          supabase.from('themes').select('*').order('name'),
          supabase.from('cognitive_tags').select('*').order('label_cs'),
        ])
        if (!tErr && t && t.length > 0) setThemes(t)
        if (!cErr && c && c.length > 0) setTags(c)
      } catch {
        // Use mock data
      }
    }
    load()
  }, [])

  useEffect(() => {
    const theme = themes.find((t) => t.id === themeId)
    const tagLabels = tags
      .filter((t) => selectedTags.includes(t.id))
      .map((t) => t.label_cs)
      .join(', ')

    if (theme && tagLabels) {
      setPromptText(buildExercisePrompt(theme.name, difficulty, tagLabels))
    }
  }, [themeId, difficulty, selectedTags, themes, tags])

  function toggleTag(tagId: string) {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    )
  }

  async function handleGenerate() {
    if (!themeId || selectedTags.length === 0 || !promptText) {
      toast.error('Vyplňte všechna povinná pole')
      return
    }

    setGenerating(true)
    try {
      const res = await fetch('/api/admin/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme_id: themeId,
          difficulty,
          cognitive_tag_ids: selectedTags,
          count,
          prompt_text: promptText,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Chyba při generování')
      }

      const data = await res.json()
      toast.success(`Vygenerováno ${data.generated} cvičení, ${data.errors} chyb`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Generování vyžaduje připojení k Supabase a AI API')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold">Generování cvičení</h1>

      <Card>
        <CardHeader>
          <CardTitle>Parametry</CardTitle>
          <CardDescription>Nastavte parametry pro generování nových cvičení</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Téma</Label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={themeId}
                onChange={(e) => setThemeId(e.target.value)}
              >
                <option value="">Vyberte téma...</option>
                {themes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Obtížnost</Label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
              >
                {difficulties.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Kognitivní funkce</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.label_cs}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Počet cvičení</Label>
            <Input
              type="number"
              min={1}
              max={20}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="space-y-2">
            <Label>Prompt pro Claude API</Label>
            <Textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              rows={8}
              placeholder="Prompt bude automaticky vygenerován po výběru parametrů..."
            />
            <p className="text-xs text-muted-foreground">
              Prompt můžete upravit před odesláním.
            </p>
          </div>

          <Button onClick={handleGenerate} disabled={generating} className="w-full gap-2">
            {generating ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Generuji...</>
            ) : (
              <><Wand2 className="h-4 w-4" /> Vygenerovat {count} cvičení</>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
