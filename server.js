import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/recipes', async (req, res) => {
  const { ingredients, time, difficulty } = req.body

  if (!ingredients?.length) {
    return res.status(400).json({ error: '재료를 입력해주세요.' })
  }

  const prompt = `당신은 20년 경력의 한식 요리 전문가입니다. 주어진 재료로 실제로 맛있게 만들 수 있는 현실적인 한국 가정식을 추천해주세요.

[입력 정보]
- 보유 재료: ${ingredients.join(', ')}
- 가능한 조리 시간: ${time}
- 원하는 난이도: ${difficulty}

[추천 기준]
- 보유 재료를 최대한 활용하는 메뉴 우선
- 서로 다른 조리 방식의 메뉴로 다양하게 구성 (예: 볶음, 국, 조림 등)
- 실제 한국 가정에서 자주 만드는 현실적인 메뉴
- 추가 재료가 적을수록 좋음

[조리 방법 작성 기준]
- 완전 초보자도 따라할 수 있게 각 단계를 하나의 동작으로 설명
- 불 세기, 시간, 양을 구체적으로 명시 (예: "중불에서 3분간", "소금 1/2 티스푼")
- 재료 손질 방법 상세히 설명
- 최소 6단계 이상 작성

반드시 아래 JSON 형식으로만 응답하고, 다른 텍스트나 마크다운은 절대 포함하지 마세요:
{
  "menus": [
    {
      "name": "메뉴명",
      "time": "예상 조리시간(예: 20분)",
      "difficulty": "쉬움 또는 보통 또는 어려움",
      "ingredients_used": ["보유 재료 중 사용한 것들"],
      "extra_needed": ["추가로 필요한 재료들, 없으면 빈 배열"],
      "steps": [
        "1. 구체적인 단계...",
        "2. 구체적인 단계..."
      ],
      "tip": "이 요리의 핵심 포인트 또는 실패하지 않는 방법"
    }
  ]
}`

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: '당신은 20년 경력의 한식 요리 전문가입니다. 주어진 재료로 실제로 맛있고 현실적인 한국 가정식 메뉴를 추천합니다. 반드시 JSON 형식으로만 응답하고, JSON 외의 텍스트나 마크다운 코드블록을 절대 포함하지 마세요.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.9,
        max_tokens: 4096,
      }),
    })

    if (!groqRes.ok) {
      const err = await groqRes.json().catch(() => ({}))
      return res.status(500).json({ error: err.error?.message || 'AI 서버 오류' })
    }

    const data = await groqRes.json()
    const content = data.choices?.[0]?.message?.content || ''
    const jsonStr = content.trim().replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '')
    const parsed = JSON.parse(jsonStr)

    res.json(parsed)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`))
