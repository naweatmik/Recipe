import { useState, useEffect } from 'react'
import styles from './ApiKeyInput.module.css'

const STORAGE_KEY = 'recipe_ai_api_key'

export default function ApiKeyInput() {
  const [key, setKey] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setKey(stored)
      setSaved(true)
    }
  }, [])

  const handleSave = () => {
    const val = key.trim()
    if (!val) return
    localStorage.setItem(STORAGE_KEY, val)
    setSaved(true)
  }

  const handleChange = (e) => {
    setKey(e.target.value)
    setSaved(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave()
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>Groq API 키</div>
      <div className={styles.row}>
        <input
          className={styles.input}
          type="password"
          value={key}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="gsk_..."
          autoComplete="off"
        />
        <button
          className={`${styles.btn} ${saved ? styles.saved : ''}`}
          onClick={handleSave}
        >
          {saved ? '✓ 저장됨' : '저장'}
        </button>
      </div>
      <div className={`${styles.hint} ${saved ? styles.hintOk : ''}`}>
        {saved
          ? '✓ API 키가 저장되어 있습니다.'
          : '무료 발급: console.groq.com → API Keys → Create API Key'}
      </div>
    </div>
  )
}
