import styles from './OptionSelector.module.css'

const TIME_OPTIONS = [
  { label: '15분', value: '15분 이내' },
  { label: '30분', value: '30분 이내' },
  { label: '1시간', value: '1시간 이내' },
]

const DIFFICULTY_OPTIONS = [
  { label: '쉬움', value: '쉬움' },
  { label: '보통', value: '보통' },
  { label: '어려움', value: '어려움' },
]

export default function OptionSelector({ time, difficulty, onTimeChange, onDifficultyChange }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>조리 옵션</div>
      <div className={styles.grid}>
        <div className={styles.group}>
          <label className={styles.label}>조리 시간</label>
          <div className={styles.buttons}>
            {TIME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`${styles.btn} ${time === opt.value ? styles.active : ''}`}
                onClick={() => onTimeChange(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.group}>
          <label className={styles.label}>난이도</label>
          <div className={styles.buttons}>
            {DIFFICULTY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`${styles.btn} ${difficulty === opt.value ? styles.active : ''}`}
                onClick={() => onDifficultyChange(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
