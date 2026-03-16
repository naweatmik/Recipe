import { useState } from 'react'
import styles from './IngredientInput.module.css'

const QUICK_ITEMS = [
  { emoji: '🥚', name: '달걀' },
  { emoji: '🧊', name: '두부' },
  { emoji: '🥬', name: '김치' },
  { emoji: '🥩', name: '돼지고기' },
  { emoji: '🧅', name: '양파' },
  { emoji: '🥕', name: '당근' },
  { emoji: '🍚', name: '밥' },
  { emoji: '🥔', name: '감자' },
  { emoji: '🍄', name: '버섯' },
  { emoji: '🥒', name: '오이' },
  { emoji: '🥫', name: '스팸' },
  { emoji: '🐟', name: '참치캔' },
]

export default function IngredientInput({ ingredients, onAdd, onRemove }) {
  const [input, setInput] = useState('')

  const handleAdd = () => {
    const val = input.trim()
    if (!val) return
    onAdd(val)
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>재료 입력</div>

      <div className={styles.row}>
        <input
          className={styles.input}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="재료 이름 입력 (예: 계란, 양파...)"
        />
        <button className={styles.btnAdd} onClick={handleAdd}>추가</button>
      </div>

      <div className={styles.quickAdd}>
        <span className={styles.quickLabel}>자주 쓰는:</span>
        {QUICK_ITEMS.map((item) => (
          <button
            key={item.name}
            className={styles.quickBtn}
            onClick={() => onAdd(item.name)}
          >
            {item.emoji} {item.name}
          </button>
        ))}
      </div>

      <div className={styles.tags}>
        {ingredients.length === 0
          ? <span className={styles.tagEmpty}>재료를 추가해주세요</span>
          : ingredients.map((item) => (
            <span key={item} className={styles.tag} onClick={() => onRemove(item)}>
              {item}
              <span className={styles.tagRemove}>×</span>
            </span>
          ))
        }
      </div>
    </div>
  )
}
