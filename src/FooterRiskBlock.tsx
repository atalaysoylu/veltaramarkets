import { useI18n } from './i18n/I18nProvider'

export function FooterRiskBlock() {
  const { messages } = useI18n()
  const { riskLegal } = messages.footer

  return (
    <div
      className="lp-footer-risk"
      aria-label={riskLegal.aria}
    >
      {riskLegal.sections.map((section, i) => (
        <section key={i} className="lp-footer-risk__section">
          <h3 className="lp-footer-risk__title">{section.title}</h3>
          {section.paragraphs.map((p, j) => (
            <p key={j} className="lp-footer-risk__p lp-preline">
              {p}
            </p>
          ))}
        </section>
      ))}
    </div>
  )
}
