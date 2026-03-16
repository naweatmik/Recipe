import { useState } from 'react'
import styles from './RecipeCard.module.css'

function DifficultyBadge({ difficulty }) {
  const cls = difficulty === '쉬움' ? styles.easy : difficulty === '어려움' ? styles.hard : styles.normal
  return <span className={`${styles.badge} ${cls}`}>{difficulty}</span>
}

export default function RecipeCard({ menu, index }) {
  const [open, setOpen] = useState(false)
  const hasExtra = menu.extra_needed?.length > 0

  return (
    <div className={styles.card}>
      <div className={styles.header} onClick={() => setOpen(!open)}>
        <div className={styles.number}>{index + 1}</div>
        <div className={styles.titleArea}>
          <div className={styles.name}>{menu.name}</div>
          <div className={styles.meta}>
            <span className={`${styles.badge} ${styles.time}`}>⏱ {menu.time}</span>
            <DifficultyBadge difficulty={menu.difficulty} />
            {hasExtra && (
              <span className={`${styles.badge} ${styles.extra}`}>
                +추가 재료 {menu.extra_needed.length}개
              </span>
            )}
          </div>
        </div>
        <span className={`${styles.toggle} ${open ? styles.open : ''}`}>▾</span>
      </div>

      {open && (
        <div className={styles.body}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>사용 재료</div>
            <div className={styles.ingredientList}>
              {menu.ingredients_used?.map((ing) => (
                <span key={ing} className={`${styles.ingTag} ${styles.have}`}>{ing}</span>
              ))}
              {menu.extra_needed?.map((ing) => (
                <span key={ing} className={`${styles.ingTag} ${styles.extraTag}`}>+ {ing}</span>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>조리 방법</div>
            <ul className={styles.steps}>
              {menu.steps?.map((step, i) => (
                <li key={i} className={styles.step}>
                  <span className={styles.stepNum}>{i + 1}</span>
                  <span className={styles.stepText}>{step.replace(/^\d+\.\s*/, '')}</span>
                </li>
              ))}
            </ul>
          </div>

          {menu.tip && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>요리 팁</div>
              <div className={styles.tip}>💡 {menu.tip}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
