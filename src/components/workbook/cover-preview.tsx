'use client'

/**
 * CoverPreview — HTML/CSS replica of the PDF cover page (workbook-document.tsx).
 * Renders a visual preview of the workbook cover without generating a PDF.
 * Uses identical color tokens and layout proportions.
 */

interface CoverPreviewProps {
  themeName: string
  difficultyLabel: string
}

// Color tokens — same as workbook-document.tsx C object
const C = {
  bgPrimary: '#FDF6EE',
  bgSection: '#FFE4C0',
  amber: '#B5660A',
  sageHalo: '#E0EDD8',
  sage: '#2E6B2A',
  card: '#FFFFFF',
  border: '#C4A882',
  amberLine: '#F0D9BC',
  textPrimary: '#1A1208',
  textSecondary: '#4A3520',
  textOnDark: '#FFFFFF',
}

export function CoverPreview({ themeName, difficultyLabel }: CoverPreviewProps) {
  return (
    <div
      style={{
        aspectRatio: '210 / 297',
        maxWidth: 400,
        width: '100%',
        backgroundColor: C.bgPrimary,
        borderRadius: 16,
        border: `2px solid ${C.border}`,
        boxShadow: '0 4px 16px rgba(26,18,8,0.10), 0 1px 4px rgba(26,18,8,0.06)',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: 'var(--font-nunito, sans-serif)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '0 auto',
      }}
    >
      {/* Content area */}
      <div style={{ padding: '28px 32px 0', textAlign: 'center', flex: 1 }}>
        {/* Headlines */}
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: C.textPrimary,
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          Trénujte paměť a myšlení.
        </h2>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: C.amber,
            lineHeight: 1.2,
            margin: '3px 0 0',
          }}
        >
          V klidu a vlastním tempem.
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 9,
            color: C.textSecondary,
            marginTop: 8,
            marginBottom: 0,
          }}
        >
          Pracovní sešit
        </p>

        {/* Divider */}
        <div
          style={{
            width: '100%',
            height: 1,
            backgroundColor: C.amberLine,
            marginTop: 10,
          }}
        />

        {/* Image placeholder */}
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: 14,
            backgroundColor: C.sageHalo,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '12px auto 0',
          }}
        >
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: 14,
              backgroundColor: C.card,
              border: `1px solid ${C.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 8, color: C.textSecondary }}>[ ilustrace ]</span>
          </div>
        </div>

        {/* Topic card */}
        <div
          style={{
            width: '85%',
            maxWidth: 260,
            borderRadius: 14,
            backgroundColor: C.bgSection,
            border: `1.5px solid ${C.border}`,
            overflow: 'hidden',
            margin: '12px auto 0',
            position: 'relative',
            padding: '10px 10px 14px',
          }}
        >
          {/* Accent bar */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 4,
              height: '100%',
              backgroundColor: C.amber,
            }}
          />
          <p
            style={{
              fontSize: 8,
              color: C.textSecondary,
              margin: 0,
              textAlign: 'center',
            }}
          >
            téma sešitu
          </p>
          <p
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: C.textPrimary,
              margin: '2px 0 0',
              textAlign: 'center',
              lineHeight: 1.1,
            }}
          >
            {themeName}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          width: '100%',
          height: 34,
          backgroundColor: C.bgSection,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        {/* Top line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: C.amber,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />
        <span style={{ fontSize: 7, color: C.textSecondary }}>
          Kognitivní trénink vlastním tempem
        </span>
        <span
          style={{
            backgroundColor: C.sage,
            color: C.textOnDark,
            fontSize: 7,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 10,
          }}
        >
          {difficultyLabel}
        </span>
      </div>
    </div>
  )
}
