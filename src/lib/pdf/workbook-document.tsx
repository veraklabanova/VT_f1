import React from 'react'
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer'
import type { ExerciseWithTags, Theme, DifficultyLevel } from '@/types'

// Register Roboto font (TTF) — reliable with react-pdf, supports Czech diacritics
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
  ],
})

// Disable word hyphenation globally — hyphenation makes reading harder for target audience
Font.registerHyphenationCallback((word) => [word])

// ── Color Tokens ──
const C = {
  bgPrimary: '#FDF6EE',
  bgSection: '#FFE4C0',
  amber: '#B5660A',
  amberLight: '#FDECD6',
  sage: '#2E6B2A',
  sageHalo: '#E0EDD8',
  amberLine: '#F0D9BC',
  amberLine35: '#EDDABC',
  terraLight: '#F5C5BC',
  card: '#FFFFFF',
  border: '#C4A882',
  borderStrong: '#8F6A40',
  textPrimary: '#1A1208',
  textSecondary: '#4A3520',
  textOnDark: '#FFFFFF',
}

// ── Shared styles ──
const s = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    backgroundColor: C.bgPrimary,
    position: 'relative',
    width: '100%',
    height: '100%',
  },

  // ── Cover ──
  coverContent: {
    paddingHorizontal: 48,
    paddingTop: 40,
    alignItems: 'center',
  },
  coverHeadline1: {
    fontSize: 34,
    fontWeight: 700,
    color: C.textPrimary,
    textAlign: 'center',
    lineHeight: 1.2,
  },
  coverHeadline2: {
    fontSize: 34,
    fontWeight: 700,
    color: C.amber,
    textAlign: 'center',
    lineHeight: 1.2,
    marginTop: 4,
  },
  coverSubtitle: {
    fontSize: 13,
    fontWeight: 400,
    color: C.textSecondary,
    marginTop: 12,
    textAlign: 'center',
  },
  coverDivider: {
    width: 698,
    height: 1,
    backgroundColor: C.amberLine,
    marginTop: 14,
    alignSelf: 'center',
  },

  // Image placeholder (cover — slightly smaller to fit page)
  imageOuter: {
    width: 360,
    height: 360,
    borderRadius: 20,
    backgroundColor: C.sageHalo,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  imageInner: {
    width: 330,
    height: 330,
    borderRadius: 20,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  coverImage: {
    width: 300,
    height: 300,
    objectFit: 'contain',
  },
  imagePlaceholderText: {
    fontSize: 11,
    color: C.textSecondary,
    fontWeight: 400,
  },

  // Topic card (cover)
  topicCard: {
    width: 400,
    height: 118,
    borderRadius: 20,
    backgroundColor: C.bgSection,
    borderWidth: 1.5,
    borderColor: C.border,
    overflow: 'hidden',
    marginTop: 16,
    position: 'relative',
  },
  topicCardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 5,
    height: 118,
    backgroundColor: C.amber,
  },
  topicCardLabel: {
    fontSize: 11,
    fontWeight: 400,
    color: C.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
  topicCardName: {
    fontSize: 40,
    fontWeight: 700,
    color: C.textPrimary,
    textAlign: 'center',
    marginTop: 4,
  },

  // ── Footer (shared) ──
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 48,
    backgroundColor: C.bgSection,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  footerTopLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: C.amber,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  footerText: {
    fontSize: 11,
    fontWeight: 400,
    color: C.textSecondary,
  },
  footerBadge: {
    backgroundColor: C.sage,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  footerBadgeText: {
    fontSize: 11,
    fontWeight: 700,
    color: C.textOnDark,
  },
  footerPageNum: {
    fontSize: 11,
    fontWeight: 700,
    color: C.amber,
  },

  // ── Exercise Page ──
  exHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 48,
    paddingTop: 20,
  },
  exNumber: {
    fontSize: 15,
    fontWeight: 700,
    color: C.textPrimary,
  },
  exTags: {
    fontSize: 10,
    fontWeight: 400,
    color: C.textSecondary,
    textAlign: 'right',
    maxWidth: 380,
  },
  exDivider: {
    width: 698,
    height: 1,
    backgroundColor: C.amberLine35,
    marginLeft: 48,
    marginTop: 10,
  },

  // Topic chip (no emoji — Roboto doesn't support them)
  topicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.amberLight,
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginLeft: 48,
    marginTop: 16,
  },
  topicChipText: {
    fontSize: 11,
    fontWeight: 700,
    color: C.amber,
  },

  // Content card (instruction text)
  contentCard: {
    marginHorizontal: 48,
    marginTop: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: C.borderStrong,
    backgroundColor: C.card,
    overflow: 'hidden',
    position: 'relative',
  },
  contentCardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 5,
    height: '100%',
    backgroundColor: C.sage,
  },
  contentCardBody: {
    paddingVertical: 18,
    paddingLeft: 24,
    paddingRight: 24,
  },
  contentCardText: {
    fontSize: 14,
    fontWeight: 400,
    color: C.textPrimary,
    lineHeight: 1.65,
  },

  // Exercise image placeholder (reduced to prevent overflow)
  exImageOuter: {
    width: 340,
    height: 310,
    borderRadius: 20,
    backgroundColor: C.sageHalo,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 12,
  },
  exImageInner: {
    width: 310,
    height: 280,
    borderRadius: 16,
    backgroundColor: C.card,
    borderWidth: 1.5,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  exImage: {
    width: 280,
    height: 250,
    objectFit: 'contain',
  },

  // Answer card — fixed position on every exercise page (above footer)
  answerCard: {
    position: 'absolute',
    bottom: 62,
    left: 48,
    right: 48,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: C.borderStrong,
    backgroundColor: C.card,
    overflow: 'hidden',
    height: 180,
  },
  answerCardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 5,
    height: 180,
    backgroundColor: C.sage,
  },
  answerLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: C.textSecondary,
    marginTop: 14,
    marginLeft: 24,
  },
  answerLine: {
    height: 1.5,
    backgroundColor: C.borderStrong,
    marginHorizontal: 24,
    width: 650,
  },

  // ── Instructions Page ──
  instrTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: C.textPrimary,
    marginBottom: 4,
  },
  instrSectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: C.textSecondary,
    marginTop: 12,
    marginBottom: 4,
  },
  instrText: {
    fontSize: 14,
    fontWeight: 400,
    color: C.textPrimary,
    lineHeight: 1.65,
  },
})

// ── Reusable Components ──

function PdfFooter({ leftText, rightElement }: { leftText: string; rightElement: React.ReactNode }) {
  return (
    <View style={s.footer} fixed>
      <View style={s.footerTopLine} />
      <Text style={s.footerText}>{leftText}</Text>
      {rightElement}
    </View>
  )
}

function ContentCardWithAccent({ children, accentColor, style }: {
  children: React.ReactNode
  accentColor?: string
  style?: any
}) {
  return (
    <View style={[s.contentCard, style]}>
      <View style={[s.contentCardAccent, accentColor ? { backgroundColor: accentColor } : {}]} />
      <View style={s.contentCardBody}>
        {children}
      </View>
    </View>
  )
}

function ImagePlaceholder({
  imageUrl,
  outerStyle,
  innerStyle,
  imgStyle,
}: {
  imageUrl: string | null
  outerStyle: any
  innerStyle: any
  imgStyle: any
}) {
  return (
    <View style={outerStyle}>
      <View style={innerStyle}>
        {imageUrl ? (
          <Image src={imageUrl} style={imgStyle} />
        ) : (
          <Text style={s.imagePlaceholderText}>[ ilustrace ]</Text>
        )}
      </View>
    </View>
  )
}

// ── Document ──

interface WorkbookDocumentProps {
  theme: Theme
  difficulty: DifficultyLevel
  difficultyLabel: string
  exercises: ExerciseWithTags[]
}

export function WorkbookDocument({ theme, difficulty, difficultyLabel, exercises }: WorkbookDocumentProps) {
  // Count unique cognitive tags across all exercises
  const uniqueTags = new Set<string>()
  for (const ex of exercises) {
    for (const tag of ex.tags) {
      uniqueTags.add(tag.id)
    }
  }
  const tagCount = uniqueTags.size

  // Cover image: use first exercise's image, fallback to theme cover
  const coverImageUrl = exercises[0]?.image_url || theme.cover_image_url || null

  return (
    <Document
      title={`Vlastním tempem — ${theme.name} (${difficultyLabel})`}
      author="Vlastním tempem, z.s."
      subject="Pracovní sešit pro kognitivní trénink"
      language="cs"
    >
      {/* ═══════════════ PAGE 1: COVER ═══════════════ */}
      <Page size="A4" style={s.page}>
        <View style={s.coverContent}>
          <Text style={s.coverHeadline1}>Trénujte paměť a myšlení.</Text>
          <Text style={s.coverHeadline2}>V klidu a vlastním tempem.</Text>
          <Text style={s.coverSubtitle}>Pracovní sešit</Text>
          <View style={s.coverDivider} />

          {/* Image: first exercise image or placeholder */}
          <ImagePlaceholder
            imageUrl={coverImageUrl}
            outerStyle={s.imageOuter}
            innerStyle={s.imageInner}
            imgStyle={s.coverImage}
          />

          {/* Topic card */}
          <View style={s.topicCard}>
            <View style={s.topicCardAccent} />
            <Text style={s.topicCardLabel}>téma sešitu</Text>
            <Text style={s.topicCardName}>{theme.name}</Text>
          </View>

        </View>

        {/* Footer with difficulty badge */}
        <PdfFooter
          leftText="Kognitivní trénink vlastním tempem"
          rightElement={
            <View style={s.footerBadge}>
              <Text style={s.footerBadgeText}>Obtížnost: {difficultyLabel}</Text>
            </View>
          }
        />
      </Page>

      {/* ═══════════════ PAGES 2-11: EXERCISES ═══════════════ */}
      {exercises.map((exercise, index) => (
        <Page key={exercise.id} size="A4" style={s.page}>
          {/* Header: exercise number + tags */}
          <View style={s.exHeader}>
            <Text style={s.exNumber}>Cvičení {index + 1} / {exercises.length}</Text>
            <Text style={s.exTags}>
              {exercise.tags.map((t) => t.label_cs).join(' · ')}
            </Text>
          </View>
          <View style={s.exDivider} />

          {/* Topic chip (text only, no emoji) */}
          <View style={s.topicChip}>
            <Text style={s.topicChipText}>{theme.name}</Text>
          </View>

          {/* Instruction card with exercise text */}
          <ContentCardWithAccent>
            <Text style={s.contentCardText}>{exercise.text_content}</Text>
          </ContentCardWithAccent>

          {/* Image */}
          <ImagePlaceholder
            imageUrl={exercise.image_url || null}
            outerStyle={s.exImageOuter}
            innerStyle={s.exImageInner}
            imgStyle={s.exImage}
          />

          {/* "Moje odpovedi" card */}
          <View style={s.answerCard}>
            <View style={s.answerCardAccent} />
            <Text style={s.answerLabel}>Moje odpovědi:</Text>
            {[0, 1, 2, 3, 4].map((i) => (
              <View key={i} style={[s.answerLine, { marginTop: i === 0 ? 10 : 22 }]} />
            ))}
          </View>

          {/* Footer */}
          <PdfFooter
            leftText={theme.name}
            rightElement={<Text style={s.footerPageNum}>{index + 2}</Text>}
          />
        </Page>
      ))}

      {/* ═══════════════ PAGE 12: INSTRUCTIONS ═══════════════ */}
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.exHeader}>
          <Text style={s.exNumber}>Pokyny pro pečující</Text>
          <Text style={s.exTags}></Text>
        </View>
        <View style={s.exDivider} />

        {/* Instructions in content card — NO topic chip on this page */}
        <ContentCardWithAccent style={{ marginTop: 20 }}>
          <Text style={s.instrTitle}>Jak pracovat s tímto sešitem</Text>
          <Text style={s.instrText}>
            Tento pracovní sešit obsahuje 10 cvičení zaměřených na různé kognitivní funkce.
            Cvičení jsou navržena tak, aby byla přiměřená zvolené úrovni obtížnosti.
          </Text>

          <Text style={s.instrSectionTitle}>Doporučený postup</Text>
          <Text style={s.instrText}>1. Vyberte klidné prostředí bez rušivých vlivů.</Text>
          <Text style={s.instrText}>2. Pracujte na jednom cvičení denně, nebo dle možností a nálady.</Text>
          <Text style={s.instrText}>3. Nespěchejte — důležitý je proces, ne rychlost.</Text>
          <Text style={s.instrText}>4. Pokud je cvičení příliš obtížné, přeskočte ho a vraťte se k němu později.</Text>
          <Text style={s.instrText}>5. Chvalte a povzbuzujte — každý pokus je cenný.</Text>

          <Text style={s.instrSectionTitle}>Důležité</Text>
          <Text style={s.instrText}>
            Tyto materiály slouží jako podpora kognitivního tréninku a nenahrazují odbornou
            lékařskou péči. V případě jakýchkoli pochybností se poraďte s ošetřujícím lékařem.
          </Text>

          <Text style={s.instrSectionTitle}>Kontakt</Text>
          <Text style={s.instrText}>
            Email:{'\n'}
            Web:
          </Text>
        </ContentCardWithAccent>

        {/* Footer */}
        <PdfFooter
          leftText={theme.name}
          rightElement={<Text style={s.footerPageNum}>{exercises.length + 2}</Text>}
        />
      </Page>
    </Document>
  )
}
