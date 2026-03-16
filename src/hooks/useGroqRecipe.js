import { useState } from 'react'

export function useGroqRecipe() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [menus, setMenus] = useState([])

  async function fetchRecipes(ingredients, time, difficulty) {
    setError('')
    setMenus([])
    setLoading(true)

    try {
      const resp = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, time, difficulty }),
      })

      const data = await resp.json()

      if (!resp.ok) throw new Error(data.error || `오류 (${resp.status})`)
      if (!data.menus || !Array.isArray(data.menus)) throw new Error('응답 형식이 올바르지 않습니다.')

      setMenus(data.menus)
    } catch (e) {
      setError(`오류가 발생했습니다: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, menus, fetchRecipes }
}
