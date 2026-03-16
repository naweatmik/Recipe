import { useState } from 'react'
import IngredientInput from './components/IngredientInput'
import OptionSelector from './components/OptionSelector'
import RecipeCard from './components/RecipeCard'
import { useGroqRecipe } from './hooks/useGroqRecipe'
import styles from './App.module.css'

export default function App() {
  const [ingredients, setIngredients] = useState([])
  const [time, setTime] = useState('15분 이내')
  const [difficulty, setDifficulty] = useState('쉬움')
  const { loading, error, menus, fetchRecipes } = useGroqRecipe()

  const handleAdd = (item) => {
    if (!ingredients.includes(item)) {
      setIngredients((prev) => [...prev, item])
    }
  }

  const handleRemove = (item) => {
    setIngredients((prev) => prev.filter((i) => i !== item))
  }

  const handleSubmit = () => {
    if (ingredients.length === 0) return
    fetchRecipes(ingredients, time, difficulty)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>🍳 우리집 냉장고 털어먹기</h1>
        <p className={styles.subtitle}>냉장고 재료를 입력하면 만들 수 있는 메뉴를 추천해드려요</p>
      </header>

      <IngredientInput
        ingredients={ingredients}
        onAdd={handleAdd}
        onRemove={handleRemove}
      />

      <OptionSelector
        time={time}
        difficulty={difficulty}
        onTimeChange={setTime}
        onDifficultyChange={setDifficulty}
      />

      {error && <div className={styles.error}>{error}</div>}

      <button
        className={styles.btnRecommend}
        onClick={handleSubmit}
        disabled={loading || ingredients.length === 0}
      >
        {loading
          ? <><span className={styles.spinner} /> 레시피 분석 중...</>
          : '🍽️ AI 레시피 추천받기'
        }
      </button>

      {menus.length > 0 && (
        <div className={styles.results}>
          <div className={styles.resultsHeader}>추천 메뉴 {menus.length}가지</div>
          {menus.map((menu, i) => (
            <RecipeCard key={i} menu={menu} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
