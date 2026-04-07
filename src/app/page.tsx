import Link from 'next/link'
import { Brain, Shield } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'var(--font-nunito, var(--font-sans))' }}>
      {/* Fixed header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Prototype banner */}
        <div className="px-4 py-3" style={{ backgroundColor: 'var(--lp-amber-light)', borderBottom: '1px solid var(--lp-amber)' }}>
          <div className="max-w-5xl mx-auto flex items-start gap-3">
            <Shield className="h-5 w-5 mt-0.5 shrink-0" style={{ color: 'var(--lp-amber)' }} />
            <p className="text-sm" style={{ color: 'var(--lp-text-secondary)' }}>
              <strong>Toto je funkční prototyp</strong> aplikace Vlastním tempem.
              Slouží pro testování a demonstraci. Data a obsah mohou být neúplné.
            </p>
          </div>
        </div>

        {/* Header */}
        <header style={{ backgroundColor: 'var(--lp-card-bg)', borderBottom: '2px solid var(--lp-border)' }}>
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-7 w-7" style={{ color: 'var(--lp-amber)' }} />
              <span className="text-xl font-bold" style={{ color: 'var(--lp-text)' }}>Vlastním tempem</span>
            </div>
            <Link href="/login">
              <button
                className="px-5 py-2 text-sm font-semibold"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--lp-amber)',
                  border: '2px solid var(--lp-amber)',
                  borderRadius: '9999px',
                }}
              >
                Přihlásit se
              </button>
            </Link>
          </div>
        </header>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-[7rem]" />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative py-16 px-4" style={{ backgroundColor: 'var(--lp-bg-primary)' }}>
        {/* Side accents */}
        <div className="absolute left-0 top-0 w-1.5 h-96" style={{ backgroundColor: 'var(--lp-amber)' }} />
        <div className="absolute right-0 top-0 w-1.5 h-96" style={{ backgroundColor: 'var(--lp-amber)' }} />

        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--lp-text)', lineHeight: 1.2 }}>
            Trénujte paměť a myšlení.
          </h1>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6" style={{ color: 'var(--lp-amber)', lineHeight: 1.2 }}>
            V klidu a vlastním tempem.
          </h1>
          <p className="text-base max-w-xl mx-auto mb-8" style={{ color: 'var(--lp-text-secondary)', lineHeight: 1.65 }}>
            Připravili jsme pro vás pracovní sešity, které pomáhají udržovat
            mysl v kondici. Jsou sestavené odborníky a přizpůsobí se přesně tomu,
            co vy nebo vaši blízcí právě teď zvládnete.
          </p>
          <Link href="/onboarding">
            <button
              className="px-8 py-3 text-lg font-semibold inline-flex items-center gap-2"
              style={{
                backgroundColor: 'var(--lp-amber)',
                color: 'var(--lp-text-on-dark)',
                borderRadius: '9999px',
                border: 'none',
                minHeight: '52px',
              }}
            >
              Začít zdarma &rarr;
            </button>
          </Link>
        </div>
      </section>

      {/* ═══════ DIVIDER ═══════ */}
      <div className="h-1" style={{ backgroundColor: 'var(--lp-divider)' }} />

      {/* ═══════════════ JAK TO FUNGUJE ═══════════════ */}
      <section className="py-16 px-4" style={{ backgroundColor: 'var(--lp-bg-section)' }}>
        <div className="max-w-5xl mx-auto">
          {/* Section tag */}
          <div className="text-center mb-3">
            <span
              className="inline-block px-4 py-1 text-sm font-semibold"
              style={{
                backgroundColor: 'var(--lp-amber-light)',
                color: 'var(--lp-amber)',
                borderRadius: '9999px',
              }}
            >
              Jak to funguje
            </span>
          </div>
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--lp-text)' }}>
            Tři kroky ke cvičení
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: '1', emoji: '💬', title: 'Odpovíte na pár otázek', desc: 'Zjistíme, jaká obtížnost pro vás bude ta pravá, aby vás cvičení opravdu bavilo.' },
              { num: '2', emoji: '🌻', title: 'Vyberete si téma', desc: 'Zahrada, rodina nebo třeba tradice? Zvolte si to, co je vašemu srdci nejbližší.' },
              { num: '3', emoji: '📋', title: 'Vytisknete si sešit', desc: 'Hned si stáhnete PDF dokument, který si snadno vytisknete doma. První je na nás.' },
            ].map((step) => (
              <div
                key={step.num}
                className="p-5 relative"
                style={{
                  backgroundColor: 'var(--lp-card-bg)',
                  border: '2px solid var(--lp-border)',
                  borderRadius: '16px',
                  boxShadow: 'var(--lp-shadow-card)',
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold"
                    style={{ backgroundColor: 'var(--lp-amber-step)', color: 'var(--lp-text-on-dark)' }}
                  >
                    {step.num}
                  </div>
                  <span className="text-2xl">{step.emoji}</span>
                </div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--lp-text)', fontSize: '14px' }}>{step.title}</h3>
                <p className="text-sm" style={{ color: 'var(--lp-text-secondary)', lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ DIVIDER ═══════ */}
      <div className="h-1" style={{ backgroundColor: 'var(--lp-divider)' }} />

      {/* ═══════════════ ZAČNĚTE ZDARMA ═══════════════ */}
      <section className="py-16 px-4" style={{ backgroundColor: 'var(--lp-bg-primary)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: 'var(--lp-text)' }}>
            Začněte zdarma
          </h2>
          <p className="text-center mb-8" style={{ color: 'var(--lp-text-secondary)' }}>
            První pracovní sešit je zdarma. Vyberte, kdo jste:
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { emoji: '💛', bg: 'var(--lp-amber-light)', title: 'Chci trénovat svou paměť', desc: 'Hledám cvičení pro sebe, abych se udržel/a v kondici.', href: '/onboarding?role=osoba_s_postizenim' },
              { emoji: '💚', bg: 'var(--lp-sage-light)', title: 'Hledám sešit pro blízkého', desc: 'Chci pomoci s tréninkem paměti někomu v rodině.', href: '/onboarding?role=pecujici' },
              { emoji: '🧡', bg: 'var(--lp-terra-light)', title: 'Hledáme materiály pro klienty', desc: 'Pro domovy seniorů a centra.', href: '/onboarding?role=organizace' },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="block p-5 transition-all hover:-translate-y-0.5 no-underline"
                style={{
                  backgroundColor: card.bg,
                  border: '2px solid var(--lp-border)',
                  borderRadius: '20px',
                  boxShadow: 'var(--lp-shadow-card)',
                }}
              >
                <div
                  className="w-13 h-13 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'rgba(255,255,255,0.7)', width: '52px', height: '52px' }}
                >
                  <span className="text-2xl">{card.emoji}</span>
                </div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--lp-text)', fontSize: '16px', lineHeight: 1.2 }}>
                  {card.title}
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--lp-text-secondary)', lineHeight: 1.65 }}>
                  {card.desc}
                </p>
                <span
                  className="inline-block px-5 py-2 text-sm font-semibold"
                  style={{
                    backgroundColor: 'var(--lp-sage)',
                    color: 'var(--lp-text-on-dark)',
                    borderRadius: '9999px',
                    minHeight: '36px',
                  }}
                >
                  Začít &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ DIVIDER ═══════ */}
      <div className="h-1" style={{ backgroundColor: 'var(--lp-divider)' }} />

      {/* ═══════════════ FEATURE STRIP ═══════════════ */}
      <section className="py-12 px-4" style={{ backgroundColor: 'var(--lp-bg-section)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { emoji: '📚', title: 'Sestavené odborníky', desc: 'Cvičení cílí na paměť, pozornost, orientaci a logické myšlení.' },
              { emoji: '🎯', title: 'Přizpůsobená obtížnost', desc: 'Tři úrovně zajistí, že materiály odpovídají aktuálním schopnostem.' },
              { emoji: '🌿', title: 'Příjemné prostředí', desc: 'Klidný, přehledný design.' },
              { emoji: '🖨️', title: 'Tisk doma', desc: 'Stačí tiskárna. Žádná aplikace, žádné přihlašování, žádný stres.' },
            ].map((feature) => (
              <div key={feature.title} className="flex gap-4">
                <div className="shrink-0 w-1 rounded-full" style={{ backgroundColor: 'var(--lp-amber)' }} />
                <div>
                  <span className="text-xl block mb-2">{feature.emoji}</span>
                  <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--lp-text)' }}>{feature.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--lp-text-secondary)', lineHeight: 1.65 }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ DIVIDER ═══════ */}
      <div className="h-1" style={{ backgroundColor: 'var(--lp-divider)' }} />

      {/* ═══════════════ TESTIMONIAL ═══════════════ */}
      <section className="relative py-16 px-4 text-center" style={{ backgroundColor: 'var(--lp-amber-light)' }}>
        {/* Side accents */}
        <div className="absolute left-0 top-0 w-2 h-full" style={{ backgroundColor: 'var(--lp-amber)' }} />
        <div className="absolute right-0 top-0 w-2 h-full" style={{ backgroundColor: 'var(--lp-amber)' }} />

        <div className="max-w-3xl mx-auto">
          <div className="text-6xl mb-4" style={{ color: 'var(--lp-amber)', fontFamily: 'Georgia, serif' }}>&ldquo;</div>
          <p className="text-xl font-semibold mb-4" style={{ color: 'var(--lp-text)', lineHeight: 1.65 }}>
            Maminka se na cvičení těší každý den. Říká, že ji baví a že jsou
            přesně na její úroveň.
          </p>
          <p className="text-sm" style={{ color: 'var(--lp-text-secondary)' }}>
            — dcera uživatelky, Praha
          </p>
        </div>
      </section>

      {/* ═══════ DIVIDER ═══════ */}
      <div className="h-1" style={{ backgroundColor: 'var(--lp-divider)' }} />

      {/* ═══════════════ CTA FOOTER ═══════════════ */}
      <section className="py-12 px-4 text-center" style={{ backgroundColor: 'var(--lp-bg-primary)' }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--lp-text)' }}>
          Připraveni začít? První sešit je zdarma.
        </h2>
        <Link href="/onboarding">
          <button
            className="px-8 py-3 text-lg font-semibold inline-flex items-center gap-2"
            style={{
              backgroundColor: 'var(--lp-amber)',
              color: 'var(--lp-text-on-dark)',
              borderRadius: '9999px',
              border: 'none',
              minHeight: '48px',
            }}
          >
            Začít zdarma &rarr;
          </button>
        </Link>
      </section>

      {/* ═══════ DIVIDER ═══════ */}
      <div className="h-1" style={{ backgroundColor: 'var(--lp-divider)' }} />

      {/* ═══════════════ DARK FOOTER ═══════════════ */}
      <footer className="py-6 px-4 text-center" style={{ backgroundColor: 'var(--lp-footer-bg)' }}>
        <p className="text-xs" style={{ color: 'var(--lp-text-on-dark-muted)' }}>
          &copy; {new Date().getFullYear()} — Kognitivní trénink
        </p>
      </footer>
    </div>
  )
}
