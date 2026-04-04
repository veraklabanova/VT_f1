import React from 'react'
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer'
import type { ExerciseWithTags, Theme, DifficultyLevel } from '@/types'

// Register font with Czech character support
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 'normal' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 'light' },
  ],
})

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 50,
    backgroundColor: '#ffffff',
  },
  // Cover page
  coverPage: {
    fontFamily: 'Roboto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 50,
  },
  coverTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  coverSubtitle: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 40,
    textAlign: 'center',
  },
  coverTheme: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 40,
    marginBottom: 12,
    textAlign: 'center',
  },
  coverDifficulty: {
    fontSize: 16,
    color: '#888888',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
    textAlign: 'center',
  },
  coverImage: {
    width: 250,
    height: 250,
    borderRadius: 12,
    marginVertical: 30,
  },
  coverOrg: {
    fontSize: 12,
    color: '#999999',
    marginTop: 'auto',
    textAlign: 'center',
  },

  // Exercise page
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
  },
  exerciseNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666666',
  },
  exerciseTags: {
    fontSize: 9,
    color: '#999999',
  },
  exerciseText: {
    fontSize: 14,
    lineHeight: 1.8,
    color: '#333333',
    marginBottom: 20,
  },
  exerciseImage: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    borderRadius: 8,
    marginTop: 10,
  },

  // Instructions page
  instructionsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  instructionsText: {
    fontSize: 11,
    lineHeight: 1.7,
    color: '#444444',
    marginBottom: 10,
  },
  instructionsBold: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 15,
    marginBottom: 5,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 9,
    color: '#bbbbbb',
  },
  pageNumber: {
    fontSize: 9,
    color: '#bbbbbb',
  },
})

interface WorkbookDocumentProps {
  theme: Theme
  difficulty: DifficultyLevel
  difficultyLabel: string
  exercises: ExerciseWithTags[]
}

export function WorkbookDocument({ theme, difficulty, difficultyLabel, exercises }: WorkbookDocumentProps) {
  return (
    <Document
      title={`Vlastním tempem — ${theme.name} (${difficultyLabel})`}
      author="Vlastním tempem, z.s."
      subject="Pracovní sešit pro kognitivní trénink"
      language="cs"
    >
      {/* Page 1: Cover */}
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.coverTitle}>Vlastním tempem</Text>
        <Text style={styles.coverSubtitle}>Pracovní sešit</Text>

        {theme.cover_image_url && (
          <Image src={theme.cover_image_url} style={styles.coverImage} />
        )}

        <Text style={styles.coverTheme}>{theme.name}</Text>
        <Text style={styles.coverDifficulty}>Obtížnost: {difficultyLabel}</Text>

        <Text style={styles.coverOrg}>
          Vlastním tempem, z.s. — Kognitivní trénink vlastním tempem
        </Text>
      </Page>

      {/* Pages 2-11: Exercises */}
      {exercises.map((exercise, index) => (
        <Page key={exercise.id} size="A4" style={styles.page}>
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseNumber}>Cvičení {index + 1} / {exercises.length}</Text>
            <Text style={styles.exerciseTags}>
              {exercise.tags.map((t) => t.label_cs).join(' • ')}
            </Text>
          </View>

          <Text style={styles.exerciseText}>{exercise.text_content}</Text>

          {exercise.image_url && (
            <Image src={exercise.image_url} style={styles.exerciseImage} />
          )}

          <View style={styles.footer} fixed>
            <Text style={styles.footerText}>Vlastním tempem — {theme.name}</Text>
            <Text style={styles.pageNumber}>{index + 2}</Text>
          </View>
        </Page>
      ))}

      {/* Page 12: Instructions */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.instructionsTitle}>Pokyny pro pečující</Text>

        <Text style={styles.instructionsBold}>Jak pracovat s tímto sešitem</Text>
        <Text style={styles.instructionsText}>
          Tento pracovní sešit obsahuje 10 cvičení zaměřených na různé kognitivní funkce.
          Cvičení jsou navržena tak, aby byla přiměřená zvolené úrovni obtížnosti.
        </Text>

        <Text style={styles.instructionsBold}>Doporučený postup</Text>
        <Text style={styles.instructionsText}>
          1. Vyberte klidné prostředí bez rušivých vlivů.
        </Text>
        <Text style={styles.instructionsText}>
          2. Pracujte na jednom cvičení denně, nebo dle možností a nálady.
        </Text>
        <Text style={styles.instructionsText}>
          3. Nespěchejte — důležitý je proces, ne rychlost.
        </Text>
        <Text style={styles.instructionsText}>
          4. Pokud je cvičení příliš obtížné, přeskočte ho a vraťte se k němu později.
        </Text>
        <Text style={styles.instructionsText}>
          5. Chvalte a povzbuzujte — každý pokus je cenný.
        </Text>

        <Text style={styles.instructionsBold}>Důležité</Text>
        <Text style={styles.instructionsText}>
          Tyto materiály slouží jako podpora kognitivního tréninku a nenahrazují odbornou
          lékařskou péči. V případě jakýchkoli pochybností se poraďte s ošetřujícím lékařem.
        </Text>

        <Text style={styles.instructionsBold}>Kontakt</Text>
        <Text style={styles.instructionsText}>
          Vlastním tempem, z.s.{'\n'}
          Email: info@vlastnimtempem.cz{'\n'}
          Web: www.vlastnimtempem.cz
        </Text>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Vlastním tempem — {theme.name}</Text>
          <Text style={styles.pageNumber}>12</Text>
        </View>
      </Page>
    </Document>
  )
}
