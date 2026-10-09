import { Globe2, ChevronDown } from 'lucide-react'
import { languages, setLanguage, useLanguage, type Language } from '../i18n'

function LanguageSelector() {
  const currentLanguage = useLanguage()

  const handleChange = (language: Language) => {
    setLanguage(language)
  }

  return (
    <div className="language-selector">
      <Globe2 size={17} />

      <select
        value={currentLanguage}
        onChange={(event) =>
          handleChange(event.target.value as Language)
        }
        aria-label="Select language"
      >
        {Object.entries(languages).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>

      <ChevronDown size={15} className="language-chevron" />
    </div>
  )
}

export default LanguageSelector